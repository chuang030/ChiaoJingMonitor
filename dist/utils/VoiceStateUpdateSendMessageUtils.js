"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceStateUpdateSendMessageUtils = void 0;
const SendMessageFormatUtils_1 = require("./SendMessageFormatUtils");
const RandomMessageUtils_1 = require("./RandomMessageUtils");
/**
 *
 */
class VoiceStateUpdateSendMessageUtils extends SendMessageFormatUtils_1.SendMessageFormatUtils {
    /**
     *
     * @param voiceStateUpdateSandMessageOption
     */
    constructor(voiceStateUpdateSandMessageOption) {
        super(voiceStateUpdateSandMessageOption === null || voiceStateUpdateSandMessageOption === void 0 ? void 0 : voiceStateUpdateSandMessageOption.sendMessageFormatUtilsOption);
        this.randomMessageUtils = new RandomMessageUtils_1.RandomMessageUtils();
        if ((voiceStateUpdateSandMessageOption === null || voiceStateUpdateSandMessageOption === void 0 ? void 0 : voiceStateUpdateSandMessageOption.randomMessageUtils) != undefined ||
            (voiceStateUpdateSandMessageOption === null || voiceStateUpdateSandMessageOption === void 0 ? void 0 : voiceStateUpdateSandMessageOption.randomMessageUtils) != null) {
            this.setRandomMessageOption(voiceStateUpdateSandMessageOption.randomMessageUtils);
        }
    }
    ;
    /**
     * Set random message option. \
     * Random Message Option:
     *  - Emoji Pool
     *  - Message Pool
     * @param randomMessageUtils Random Message Object.
     */
    setRandomMessageOption(randomMessageUtils) {
        this.randomMessageUtils.setEmojiPool = randomMessageUtils.getEmojiPool;
        this.randomMessageUtils.setMessagePool = randomMessageUtils.getMessagePool;
    }
    /**
     * Get send message in format string.
     * @param message Input contain format tga string.
     * @returns sand message.
     */
    getSendMessage(message) {
        this.setOtherMessageString = new Array(this.randomMessageUtils.getRandomMessage());
        this.setEemoji = new Array(this.randomMessageUtils.getRandomEmoji());
        return this.formatString(message);
    }
}
exports.VoiceStateUpdateSendMessageUtils = VoiceStateUpdateSendMessageUtils;
