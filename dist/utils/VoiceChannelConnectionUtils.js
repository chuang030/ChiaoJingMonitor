"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceChannelConnectionUtils = void 0;
const voice_1 = require("@discordjs/voice");
class VoiceChannelConnectionUtils {
    constructor(voiceChannelConnectionUtilsOptions) {
        this.client = null;
        this.guildId = "";
        this.voiceChannel = null;
        this.voiceChannelId = "";
        this.joinVoiceChannelOptions = null;
        this.connectedVoice = null;
        if (voiceChannelConnectionUtilsOptions === undefined)
            return;
        this.client = voiceChannelConnectionUtilsOptions.client;
        this.guildId = voiceChannelConnectionUtilsOptions.guildId;
        this.voiceChannel = voiceChannelConnectionUtilsOptions.voiceChannel;
        this.joinVoiceChannelOptions = voiceChannelConnectionUtilsOptions.joinVoiceChannelOptions;
    }
    ;
    set setClient(client) {
        this.client = client;
    }
    set setVoiceChannel(voiceChannel) {
        this.voiceChannel = voiceChannel;
    }
    ;
    get getVoiceChannel() {
        return this.voiceChannel;
    }
    ;
    set setVoiceChannelId(voiceChannelId) {
        this.voiceChannelId = voiceChannelId;
    }
    ;
    get getVoiceChannelId() {
        return this.voiceChannelId;
    }
    ;
    set setGuildId(guildId) {
        this.guildId = guildId;
    }
    ;
    get getGuildId() {
        return this.guildId;
    }
    ;
    get getConnectedVoice() {
        return this.connectedVoice;
    }
    ;
    set setJoinVoiceChannelOptions(options) {
        this.joinVoiceChannelOptions = options;
    }
    ;
    /**
     * Connection to voice channel.
     * @returns VoiceConnection.
     */
    voiceConnection() {
        if (this.getVoiceChannel === null)
            return;
        if (this.joinVoiceChannelOptions) {
            this.connectedVoice = (0, voice_1.joinVoiceChannel)(this.joinVoiceChannelOptions);
        }
        else {
            this.connectedVoice = (0, voice_1.joinVoiceChannel)({
                channelId: this.voiceChannelId || this.getVoiceChannel.id,
                group: 'default',
                guildId: this.getGuildId,
                selfDeaf: false,
                selfMute: false,
                adapterCreator: this.getVoiceChannel.guild.voiceAdapterCreator
            });
        }
        ;
        return this.connectedVoice;
    }
    ;
    /**
     * Destroy voice channel connection.
     * @param voiceConnection Connected voice channel.
     */
    connectionDestroy(adapterAvailable) {
        var _a;
        if (this.getGuildId === null || this.getGuildId === undefined)
            return;
        if (this.connectedVoice === null)
            return;
        try {
            this.connectedVoice.destroy(adapterAvailable);
            this.connectedVoice = null;
            (_a = this.client) === null || _a === void 0 ? void 0 : _a.commands.delete(this.getGuildId);
        }
        catch (error) {
            console.error(error);
        }
        ;
    }
    ;
}
exports.VoiceChannelConnectionUtils = VoiceChannelConnectionUtils;
;
