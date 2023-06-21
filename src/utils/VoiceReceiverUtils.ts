
import { User } from 'discord.js';
import {
    entersState,
    VoiceConnectionStatus,
    VoiceReceiver,
    EndBehaviorType,
    VoiceConnection,
} from '@discordjs/voice';
import {
    VoiceChannelConnectionUtils,
    VoiceChannelConnectionUtilsOptions
} from './VoiceChannelConnectionUtils';
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream';
import { DateFormat } from './DataProcessingUtils';
const prism = require('prism-media');

export class VoiceReceiverUtils extends VoiceChannelConnectionUtils {
    private static instance: VoiceReceiverUtils;
    private receiverUserId: string = "";
    private receiverChannelId: string = "";


    private constructor(voiceChannelConnectionUtilsOptions?: VoiceChannelConnectionUtilsOptions) {
        super(voiceChannelConnectionUtilsOptions);
    };

    static getInstance(voiceChannelConnectionUtilsOptions?: VoiceChannelConnectionUtilsOptions) {
        if (this.instance) return this.instance;
        this.instance = new VoiceReceiverUtils(voiceChannelConnectionUtilsOptions);
        return this.instance;
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
        this.receiverChannelId = receiverChannelId;
    };

    /**
     * Get receiver user ID.
     */
    get getReceiverChannelId(): string {
        return this.receiverChannelId;
    };

    /**
     * Receiver stream in voice channel.
     * @param voiceConnection he voice connection that we want to observe the state change for.
     * @param voiceConnectionStatus The various status codes a voice connection can hold at any one time.
     * @param timeoutOrSignal The maximum time we are allowing for this to occur, or a signal that will abort the operation.
     */
    public async voiceReceiver(voiceConnectionStatus: VoiceConnectionStatus, timeoutOrSignal: number): Promise<void> {
        if (!this.connectedVoice) return;
        this.client?.commands.set(this.getGuildId, this.connectedVoice);
        await entersState(this.connectedVoice, voiceConnectionStatus, timeoutOrSignal);
        const receiver = this.connectedVoice.receiver;
        receiver.speaking.on('start', (userId) => {
            const user = this.client?.users.cache.get(userId);
            if (!user) return;
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