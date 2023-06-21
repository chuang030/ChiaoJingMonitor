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
exports.VoiceReceiverUtils = void 0;
const voice_1 = require("@discordjs/voice");
const VoiceChannelConnectionUtils_1 = require("./VoiceChannelConnectionUtils");
const node_fs_1 = require("node:fs");
const node_stream_1 = require("node:stream");
const DataProcessingUtils_1 = require("./DataProcessingUtils");
const prism = require('prism-media');
class VoiceReceiverUtils extends VoiceChannelConnectionUtils_1.VoiceChannelConnectionUtils {
    constructor(voiceChannelConnectionUtilsOptions) {
        super(voiceChannelConnectionUtilsOptions);
        this.receiverUserId = "";
        this.receiverChannelId = "";
    }
    ;
    static getInstance(voiceChannelConnectionUtilsOptions) {
        if (this.instance)
            return this.instance;
        this.instance = new VoiceReceiverUtils(voiceChannelConnectionUtilsOptions);
        return this.instance;
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
        this.receiverChannelId = receiverChannelId;
    }
    ;
    /**
     * Get receiver user ID.
     */
    get getReceiverChannelId() {
        return this.receiverChannelId;
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
            if (!this.connectedVoice)
                return;
            (_a = this.client) === null || _a === void 0 ? void 0 : _a.commands.set(this.getGuildId, this.connectedVoice);
            yield (0, voice_1.entersState)(this.connectedVoice, voiceConnectionStatus, timeoutOrSignal);
            const receiver = this.connectedVoice.receiver;
            receiver.speaking.on('start', (userId) => {
                var _a;
                const user = (_a = this.client) === null || _a === void 0 ? void 0 : _a.users.cache.get(userId);
                if (!user)
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
exports.VoiceReceiverUtils = VoiceReceiverUtils;
;
