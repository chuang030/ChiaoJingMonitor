"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceChannelConnectionUtils = void 0;
const voice_1 = require("@discordjs/voice");
const node_fs_1 = require("node:fs");
const node_stream_1 = require("node:stream");
const DataProcessingUtils_1 = require("./DataProcessingUtils");
const prism = require('prism-media');
/**
 * Connection to voice and receive audio packets from other users that are speaking.
 */
class VoiceChannelConnectionUtils {
    /**
     * Connection to voice channel and receiver voice.
     * @param client Bot client.
     * @param message Message object.
     */
    constructor(client, message) {
        this.client = null;
        this.receiverUserId = "";
        this.receiverChannelId = "";
        this.message = null;
        this.connectedVoice = null;
        if (client === undefined)
            return;
        this.client = client;
        if (message === undefined)
            return;
        this.message = message;
    }
    ;
    /**
     * Set bot client.
     */
    set setClient(client) {
        this.client = client;
    }
    ;
    /**
     * Set Message object.
     */
    set setMessage(message) {
        this.message = message;
    }
    ;
    /**
     * Get the voice channel of the send message user.
     */
    get getVoiceChannel() {
        var _a, _b;
        return (_b = (_a = this.message) === null || _a === void 0 ? void 0 : _a.member) === null || _b === void 0 ? void 0 : _b.voice.channel;
    }
    ;
    /**
     * Get the guild ID of the send message.
     */
    get getGuildId() {
        var _a;
        return (_a = this.message) === null || _a === void 0 ? void 0 : _a.guildId;
    }
    ;
    /**
     * Set receiver user ID.
     */
    set setReceiverUserId(receiverUserId) {
        this.receiverUserId = receiverUserId;
    }
    /**
     * Get receiver user ID.
     */
    get getReceiverUserId() {
        return this.receiverUserId;
    }
    /**
     * Set receiver user ID.
     */
    set setReceiverChannelId(receiverChannelId) {
        this.receiverUserId = receiverChannelId;
    }
    /**
     * Get receiver user ID.
     */
    get getReceiverChannelId() {
        return this.receiverChannelId;
    }
    /**
     * Get VoiceConnection.
     */
    get getConnectedVoice() {
        return this.connectedVoice;
    }
    /**
     * Connection to voice channel.
     * @returns VoiceConnection.
     */
    voiceConnection(options) {
        if (this.getGuildId === null || this.getGuildId === undefined)
            return;
        if (this.getVoiceChannel === null || this.getVoiceChannel === undefined)
            return;
        if (options != undefined) {
            this.connectedVoice = (0, voice_1.joinVoiceChannel)(options);
        }
        else {
            this.connectedVoice = (0, voice_1.joinVoiceChannel)({
                channelId: this.getVoiceChannel.id,
                group: 'default',
                guildId: this.getGuildId,
                selfDeaf: false,
                selfMute: false,
                adapterCreator: this.getVoiceChannel.guild.voiceAdapterCreator
            });
        }
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
    /**
     * Receiver stream in voice channel.
     * @param voiceConnection he voice connection that we want to observe the state change for.
     * @param voiceConnectionStatus The various status codes a voice connection can hold at any one time.
     * @param timeoutOrSignal The maximum time we are allowing for this to occur, or a signal that will abort the operation.
     */
    voiceReceiver(voiceConnectionStatus, timeoutOrSignal) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.getGuildId === null || this.getGuildId === undefined)
                return;
            if (this.getVoiceChannel === null || this.getVoiceChannel === undefined)
                return;
            if (this.connectedVoice === null)
                return;
            (_a = this.client) === null || _a === void 0 ? void 0 : _a.commands.set(this.getGuildId, this.connectedVoice);
            yield (0, voice_1.entersState)(this.connectedVoice, voiceConnectionStatus, timeoutOrSignal);
            const receiver = this.connectedVoice.receiver;
            receiver.speaking.on('start', (userId) => {
                var _a;
                const user = (_a = this.client) === null || _a === void 0 ? void 0 : _a.users.cache.get(userId);
                if (user === undefined)
                    return;
                if (userId === this.receiverUserId) {
                    this.createReceiverStream(receiver, user);
                }
                ;
            });
        });
    }
    ;
    /**
     * Save receiver stream to local file.
     * @param receiver VoiceReceiver.
     * @param user User.
     */
    createReceiverStream(receiver, user) {
        const opusStream = receiver.subscribe(user.id, {
            end: {
                behavior: voice_1.EndBehaviorType.AfterSilence,
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
        });
        const dateFormat = new DataProcessingUtils_1.DateFormat();
        const path = `./dist/recordings/`;
        const fileName = `${path}${user.id}-${dateFormat.getFullDateHours}.pcm`;
        const out = (0, node_fs_1.createWriteStream)(fileName, { flags: 'a' });
        (0, node_stream_1.pipeline)(opusStream, oggStream, out, (error) => {
            if (error) {
                console.warn(`Error recording file ${fileName} - ${error.message}`);
            }
            else {
                console.log(`Recorded ${fileName}`);
            }
        });
    }
    ;
}
exports.VoiceChannelConnectionUtils = VoiceChannelConnectionUtils;
;
