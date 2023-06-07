"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandMessageFormatUtils = void 0;
class SandMessageFormatUtils {
    /**
     * Format message string.
     * @param sandMessageFormatUtilsOption Format option.
     */
    constructor(sandMessageFormatUtilsOption) {
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
        if (sandMessageFormatUtilsOption === undefined)
            return;
        if (sandMessageFormatUtilsOption.mentions != undefined) {
            this.mentionsUserId = (_a = sandMessageFormatUtilsOption.mentions) === null || _a === void 0 ? void 0 : _a.userId;
            this.mentionsUserName = sandMessageFormatUtilsOption.mentions.userName;
            this.mentionsVoiceChannelId = sandMessageFormatUtilsOption.mentions.channelId;
        }
        ;
        if (sandMessageFormatUtilsOption.formatTag != undefined) {
            this.formatUserIdTag = new RegExp((_b = sandMessageFormatUtilsOption.formatTag) === null || _b === void 0 ? void 0 : _b.userId, 'g');
            this.formatUserNameTag = new RegExp((_c = sandMessageFormatUtilsOption.formatTag) === null || _c === void 0 ? void 0 : _c.userName, 'g');
            this.formatChannelIdTag = new RegExp(sandMessageFormatUtilsOption.formatTag.channelId, 'g');
            if (sandMessageFormatUtilsOption.formatTag.emoji != undefined)
                this.formatEmojiTag = new RegExp(sandMessageFormatUtilsOption.formatTag.emoji);
            if (sandMessageFormatUtilsOption.formatTag.otherMessage != undefined)
                this.formatOtherMessageStringTag = new RegExp(sandMessageFormatUtilsOption.formatTag.otherMessage);
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
    set setMentionsVoiceChannel(id) {
        this.mentionsVoiceChannelId = id;
    }
    ;
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
     *
     * @param message
     * @param formatStringPool
     * @param formatStringTag
     * @returns
     */
    formatMultipleTag(message, formatStringPool, formatStringTag) {
        if (formatStringPool.length != 0) {
            for (const iterator of formatStringPool) {
                if (message.search(formatStringTag) === -1)
                    continue;
                message = message.replace(formatStringTag, iterator);
            }
            // remove 'other message format tag'
            while (message.search(formatStringTag) != -1) {
                message = message.replace(formatStringTag, "");
            }
        }
        else if (formatStringPool.length === 0 || formatStringPool === undefined) {
            // remove 'other message format tag'
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
exports.SandMessageFormatUtils = SandMessageFormatUtils;
;
