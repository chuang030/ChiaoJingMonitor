"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceChannelUtils = void 0;
const voice_1 = require("@discordjs/voice");
class VoiceChannelUtils {
    constructor(client, message) {
        this.client = null;
        this.message = null;
        this.client = client;
        this.message = message;
    }
    ;
    get voiceChannel() {
        var _a, _b;
        return (_b = (_a = this.message) === null || _a === void 0 ? void 0 : _a.member) === null || _b === void 0 ? void 0 : _b.voice.channel;
    }
    ;
    get guildId() {
        var _a;
        return (_a = this.message) === null || _a === void 0 ? void 0 : _a.guildId;
    }
    ;
    voiceConnection() {
        var _a;
        if (this.guildId === null || this.guildId === undefined)
            return;
        if (this.voiceChannel === null || this.voiceChannel === undefined)
            return;
        let connection = (_a = this.client) === null || _a === void 0 ? void 0 : _a.commands.get(this.guildId);
        return (0, voice_1.joinVoiceChannel)({
            channelId: this.voiceChannel.id,
            group: 'default',
            guildId: this.guildId,
            selfDeaf: false,
            selfMute: false,
            adapterCreator: this.voiceChannel.guild.voiceAdapterCreator
        });
    }
    ;
}
exports.VoiceChannelUtils = VoiceChannelUtils;
;
