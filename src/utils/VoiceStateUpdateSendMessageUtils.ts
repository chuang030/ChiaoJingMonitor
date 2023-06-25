import { SendMessageFormatUtils, SendMessageFormatUtilsOption } from './SendMessageFormatUtils';
import { RandomMessageUtils } from './RandomMessageUtils';

/**
 * VoiceStateUpdateSendMessage option.
 */
type VoiceStateUpdateSendMessageOption = {
    /**
     * Parent class options.
     */
    sendMessageFormatUtilsOption?: SendMessageFormatUtilsOption,
    /**
     * RandomMessageUtils class.
     */
    randomMessageUtils?: RandomMessageUtils
}

/**
 * 
 */
export class VoiceStateUpdateSendMessageUtils extends SendMessageFormatUtils {

    private randomMessageUtils: RandomMessageUtils = new RandomMessageUtils();

    /**
     * 
     * @param voiceStateUpdateSandMessageOption 
     */
    constructor(voiceStateUpdateSandMessageOption?: VoiceStateUpdateSendMessageOption) {
        super(voiceStateUpdateSandMessageOption?.sendMessageFormatUtilsOption);
        if (voiceStateUpdateSandMessageOption?.randomMessageUtils != undefined ||
            voiceStateUpdateSandMessageOption?.randomMessageUtils != null) {
            this.setRandomMessageOption(voiceStateUpdateSandMessageOption.randomMessageUtils)
        }
    };

    /**
     * Set random message option. \
     * Random Message Option:
     *  - Emoji Pool 
     *  - Message Pool
     * @param randomMessageUtils Random Message Object.
     */
    public setRandomMessageOption(randomMessageUtils: RandomMessageUtils): void {
        this.randomMessageUtils.setEmojiPool = randomMessageUtils.getEmojiPool;
        this.randomMessageUtils.setMessagePool = randomMessageUtils.getMessagePool;
    }

    /**
     * Get send message in format string.
     * @param message Input contain format tga string.
     * @returns sand message.
     */
    public getSendMessage(message: string): string {
        this.setOtherMessageString = new Array(this.randomMessageUtils.getRandomMessage());
        this.setEemoji = new Array(this.randomMessageUtils.getRandomEmoji());
        return this.formatString(message);
    }

}