import { Client, VoiceBasedChannel } from 'discord.js';
import {
    joinVoiceChannel,
    VoiceConnection,
    JoinVoiceChannelOptions,
    CreateVoiceConnectionOptions,
} from '@discordjs/voice';

export type VoiceChannelConnectionUtilsOptions = {
    client: Client,
    guildId: string,
    voiceChannel: VoiceBasedChannel,
    joinVoiceChannelOptions: CreateVoiceConnectionOptions & JoinVoiceChannelOptions,
}

export class VoiceChannelConnectionUtils {
    protected client: Client | null = null;
    protected guildId: string = "";
    protected voiceChannel: VoiceBasedChannel | null = null;
    protected voiceChannelId: string = "";
    protected joinVoiceChannelOptions:
        CreateVoiceConnectionOptions & JoinVoiceChannelOptions | null = null;
    protected connectedVoice: VoiceConnection | null = null;

    protected constructor(voiceChannelConnectionUtilsOptions?: VoiceChannelConnectionUtilsOptions) {
        if (voiceChannelConnectionUtilsOptions === undefined) return;
        this.client = voiceChannelConnectionUtilsOptions.client;
        this.guildId = voiceChannelConnectionUtilsOptions.guildId;
        this.voiceChannel = voiceChannelConnectionUtilsOptions.voiceChannel;
        this.joinVoiceChannelOptions = voiceChannelConnectionUtilsOptions.joinVoiceChannelOptions;
    };

    set setClient(client: Client) {
        this.client = client;
    }

    set setVoiceChannel(voiceChannel: VoiceBasedChannel) {
        this.voiceChannel = voiceChannel;
    };

    get getVoiceChannel(): VoiceBasedChannel | null {
        return this.voiceChannel;
    };

    set setVoiceChannelId(voiceChannelId: string) {
        this.voiceChannelId = voiceChannelId;
    };

    get getVoiceChannelId(): string {
        return this.voiceChannelId;
    };

    set setGuildId(guildId: string) {
        this.guildId = guildId;
    };

    get getGuildId(): string {
        return this.guildId;
    };

    get getConnectedVoice(): VoiceConnection | null {
        return this.connectedVoice;
    };

    set setJoinVoiceChannelOptions(options: CreateVoiceConnectionOptions & JoinVoiceChannelOptions) {
        this.joinVoiceChannelOptions = options;
    };

    /**
     * Connection to voice channel.
     * @returns VoiceConnection.
     */
    public voiceConnection(): VoiceConnection | undefined {
        if (this.getVoiceChannel === null) return;
        if (this.joinVoiceChannelOptions) {
            this.connectedVoice = joinVoiceChannel(this.joinVoiceChannelOptions);
        } else {
            this.connectedVoice = joinVoiceChannel({
                channelId: this.voiceChannelId || this.getVoiceChannel.id,
                group: 'default',
                guildId: this.getGuildId,
                selfDeaf: false,
                selfMute: false,
                adapterCreator: this.getVoiceChannel.guild.voiceAdapterCreator
            });
        };
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

};

