import { Client, Message, User, VoiceBasedChannel } from 'discord.js';
import {
    joinVoiceChannel,
    entersState,
    VoiceConnectionStatus,
    VoiceReceiver,
    EndBehaviorType,
    VoiceConnection,
    JoinVoiceChannelOptions,
    CreateVoiceConnectionOptions,
} from '@discordjs/voice';
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream';
import { DateFormat } from './DataProcessingUtils';
const prism = require('prism-media');

/**
 * Connection to voice and receive audio packets from other users that are speaking.
 */
export class VoiceChannelConnectionUtils {
    private client: Client | null = null;
    private receiverUserId: string = "";
    private receiverChannelId: string = "";
    private message: Message | null = null;
    private connectedVoice: VoiceConnection | null = null;

    /**
     * Connection to voice channel and receiver voice.
     * @param client Bot client.
     * @param message Message object.
     */
    constructor(client?: Client, message?: Message) {
        if (client === undefined) return;
        this.client = client;
        if (message === undefined) return;
        this.message = message;
    };

    /**
     * Set bot client.
     */
    set setClient(client: Client) {
        this.client = client;
    };

    /**
     * Set Message object.
     */
    set setMessage(message: Message) {
        this.message = message;
    };

    /**
     * Get the voice channel of the send message user. 
     */
    get getVoiceChannel(): VoiceBasedChannel | null | undefined {
        return this.message?.member?.voice.channel;
    };

    /**
     * Get the guild ID of the send message.
     */
    get getGuildId(): string | null | undefined {
        return this.message?.guildId;
    };

    /**
     * Set receiver user ID.
     */
    set setReceiverUserId(receiverUserId: string) {
        this.receiverUserId = receiverUserId;
    }

    /**
     * Get receiver user ID.
     */
    get getReceiverUserId(): string {
        return this.receiverUserId;
    }

    /**
     * Set receiver user ID.
     */
    set setReceiverChannelId(receiverChannelId: string) {
        this.receiverUserId = receiverChannelId;
    }

    /**
     * Get receiver user ID.
     */
    get getReceiverChannelId(): string {
        return this.receiverChannelId;
    }

    /**
     * Get VoiceConnection.
     */
    get getConnectedVoice(): VoiceConnection | null {
        return this.connectedVoice;
    }

    /**
     * Connection to voice channel.
     * @returns VoiceConnection.
     */
    public voiceConnection(options?: CreateVoiceConnectionOptions & JoinVoiceChannelOptions): VoiceConnection | undefined {
        if (this.getGuildId === null || this.getGuildId === undefined) return;
        if (this.getVoiceChannel === null || this.getVoiceChannel === undefined) return;
        if (options != undefined) {
            this.connectedVoice = joinVoiceChannel(options);
        } else {
            this.connectedVoice = joinVoiceChannel({
                channelId: this.getVoiceChannel.id,
                group: 'default',
                guildId: this.getGuildId,
                selfDeaf: false,
                selfMute: false,
                adapterCreator: this.getVoiceChannel.guild.voiceAdapterCreator
            });
        }
        return this.connectedVoice;
    };

    /**
     * Destroy voice channel connection.
     * @param voiceConnection Connected voice channel.
     */
    public connectionDestroy(adapterAvailable?: boolean): void {
        if (this.getGuildId === null || this.getGuildId === undefined) return;
        if (this.connectedVoice === null) return;
        try {
            this.connectedVoice.destroy(adapterAvailable);
            this.connectedVoice = null;
            this.client?.commands.delete(this.getGuildId);
        } catch (error) {
            console.error(error);
        };
    };

    /**
     * Receiver stream in voice channel.
     * @param voiceConnection he voice connection that we want to observe the state change for.
     * @param voiceConnectionStatus The various status codes a voice connection can hold at any one time.
     * @param timeoutOrSignal The maximum time we are allowing for this to occur, or a signal that will abort the operation.
     */
    public async voiceReceiver(voiceConnectionStatus: VoiceConnectionStatus, timeoutOrSignal: number): Promise<void> {
        if (this.getGuildId === null || this.getGuildId === undefined) return;
        if (this.getVoiceChannel === null || this.getVoiceChannel === undefined) return;
        if (this.connectedVoice === null) return;
        this.client?.commands.set(this.getGuildId, this.connectedVoice);
        await entersState(this.connectedVoice, voiceConnectionStatus, timeoutOrSignal);
        const receiver = this.connectedVoice.receiver;
        receiver.speaking.on('start', (userId) => {
            const user = this.client?.users.cache.get(userId);
            if (user === undefined) return;
            if (userId === this.receiverUserId) {
                this.createReceiverStream(receiver, user);
            };
        });
    };

    /**
     * Save receiver stream to local file.
     * @param receiver VoiceReceiver.
     * @param user User.
     */
    public createReceiverStream(receiver: VoiceReceiver, user: User): void {
        const opusStream = receiver.subscribe(user.id, {
            end: {
                behavior: EndBehaviorType.AfterSilence,
                duration: 100
            }
        });

        const oggStream = new prism.opus.OggLogicalBitstream({
            opusHead: new prism.opus.OpusHead({
                channelCount: 2,
                sampleRate: 48000
            }),
            pageSizeControl: {
                maxPackets: 10
            }
        })

        const dateFormat = new DateFormat();
        const path = `./dist/recordings/`;
        const fileName =
            `${path}${user.id}-${dateFormat.getFullDateHours}.pcm`;

        const out = createWriteStream(fileName, { flags: 'a' });

        pipeline(opusStream, oggStream, out, (error) => {
            if (error) {
                console.warn(`Error recording file ${fileName} - ${error.message}`);
            } else {
                console.log(`Recorded ${fileName}`);
            }
        });
    };
};