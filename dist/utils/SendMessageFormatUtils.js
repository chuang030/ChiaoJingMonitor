"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageFormatUtils = void 0;
class SendMessageFormatUtils {
    /**
     * Format message string.
     * @param sendMessageFormatUtilsOption Format option.
     */
    constructor(sendMessageFormatUtilsOption) {
        var _a, _b, _c;
        this.mentionsUserId = "";
        this.mentionsUserName = "";
        this.mentionsVoiceChannelId = "";
        this.emoji = [""];
        this.otherMessageString = [""];
        this.formatUserIdTag = /<userId>/g;
        this.formatUserNameTag = /<userName>/g;
        this.formatChannelIdTag = /<channelId>/g;
        this.formatEmojiTag = /<emoji>/;
        this.formatOtherMessageStringTag = /<otherMsg>/;
        if (sendMessageFormatUtilsOption === undefined)
            return;
        if (sendMessageFormatUtilsOption.mentions != undefined) {
            this.mentionsUserId = (_a = sendMessageFormatUtilsOption.mentions) === null || _a === void 0 ? void 0 : _a.userId;
            this.mentionsUserName = sendMessageFormatUtilsOption.mentions.userName;
            this.mentionsVoiceChannelId = sendMessageFormatUtilsOption.mentions.channelId;
        }
        ;
        if (sendMessageFormatUtilsOption.formatTag != undefined) {
            this.formatUserIdTag = new RegExp((_b = sendMessageFormatUtilsOption.formatTag) === null || _b === void 0 ? void 0 : _b.userId, 'g');
            this.formatUserNameTag = new RegExp((_c = sendMessageFormatUtilsOption.formatTag) === null || _c === void 0 ? void 0 : _c.userName, 'g');
            this.formatChannelIdTag = new RegExp(sendMessageFormatUtilsOption.formatTag.channelId, 'g');
            if (sendMessageFormatUtilsOption.formatTag.emoji != undefined)
                this.formatEmojiTag = new RegExp(sendMessageFormatUtilsOption.formatTag.emoji);
            if (sendMessageFormatUtilsOption.formatTag.otherMessage != undefined)
                this.formatOtherMessageStringTag = new RegExp(sendMessageFormatUtilsOption.formatTag.otherMessage);
        }
        ;
    }
    ;
    /**
     * Set mentions user id.
     */
    set setMentionsUserId(id) {
        this.mentionsUserId = id;
    }
    ;
    /**
     * Set mentions user name.
     */
    set setMentionsUserName(name) {
        this.mentionsUserName = name;
    }
    ;
    /**
     * Set mention channel id.
     */
    set setMentionsChannel(id) {
        this.mentionsVoiceChannelId = id;
    }
    ;
    /**
     * Set emoji id.
     */
    set setEemoji(emoji) {
        this.emoji = emoji;
    }
    /**
     * Set other message.
     */
    set setOtherMessageString(message) {
        this.otherMessageString = message;
    }
    ;
    /**
     * Set user id format tag.
     */
    set setFormatUserIdTag(userIdTag) {
        this.formatUserIdTag = new RegExp(userIdTag, 'g');
    }
    ;
    /**
     * Set user name format tag.
     */
    set setFormatUserNameTag(userNameTag) {
        this.formatUserNameTag = new RegExp(userNameTag, 'g');
    }
    ;
    /**
     * Set channel id format tag.
     */
    set setChannelIdTag(channelIdTag) {
        this.formatChannelIdTag = new RegExp(channelIdTag, 'g');
    }
    ;
    /**
     * Set channel id format tag.
     */
    set setEmojiTag(emojiTag) {
        this.formatEmojiTag = new RegExp(emojiTag);
    }
    ;
    /**
     * Set other message format tag.
     */
    set setfOrmatOtherMessageStringTag(formatOtherMessageStringTag) {
        this.formatOtherMessageStringTag = new RegExp(formatOtherMessageStringTag);
    }
    ;
    /**
     * Remove "formatStringTag" in string.
     * @param message Input string.
     * @param formatStringPool Format tag pool.
     * @param formatStringTag Format tag.
     * @returns String with formatting tags removed.
     */
    formatMultipleTag(message, formatStringPool, formatStringTag) {
        if (formatStringPool.length != 0) {
            for (const iterator of formatStringPool) {
                if (message.search(formatStringTag) === -1)
                    continue;
                message = message.replace(formatStringTag, iterator);
            }
            // remove 'message format tag'
            while (message.search(formatStringTag) != -1) {
                message = message.replace(formatStringTag, "");
            }
        }
        else if (formatStringPool.length === 0 || formatStringPool === undefined) {
            // remove 'message format tag'
            while (message.search(formatStringTag) != -1) {
                message = message.replace(formatStringTag, "");
            }
        }
        return message;
    }
    /**
     * Format string to discord markdown.
     * @param message Input contain format tga string.
     * @returns Format string.
     */
    formatString(message) {
        if (this.mentionsUserId === null || this.mentionsUserId === "")
            message = message.replace(this.formatUserIdTag, "");
        if (this.mentionsUserName === null || this.mentionsUserName === "")
            message = message.replace(this.formatUserNameTag, "");
        if (this.mentionsVoiceChannelId === null || this.mentionsVoiceChannelId === "")
            message = message.replace(this.formatChannelIdTag, "");
        message = this.formatMultipleTag(message, this.otherMessageString, this.formatOtherMessageStringTag);
        message = this.formatMultipleTag(message, this.emoji, this.formatEmojiTag);
        return message
            .replace(this.formatUserIdTag, ` <@${this.mentionsUserId}> `)
            .replace(this.formatUserNameTag, ` **${this.mentionsUserName}** `)
            .replace(this.formatChannelIdTag, ` <#${this.mentionsVoiceChannelId}> `);
    }
    ;
}
exports.SendMessageFormatUtils = SendMessageFormatUtils;
;
