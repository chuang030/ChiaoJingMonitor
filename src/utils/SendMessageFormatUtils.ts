export type SendMessageFormatUtilsOption = {
    /** mentions option*/
    mentions?: {
        /** mentions user id*/
        userId: string,
        /** mentions user name*/
        userName: string,
        /** mentions channel id*/
        channelId: string
    },
    /** format tag option*/
    formatTag?: {
        /** user id format tag*/
        userId: string,
        /** user name format tag*/
        userName: string,
        /** channel id format tag*/
        channelId: string,
        /** emoji format tag*/
        emoji?: string,
        /** other message format tag*/
        otherMessage?: string
    }
};
export class SendMessageFormatUtils {

    private mentionsUserId: string = "";
    private mentionsUserName: string = "";
    private mentionsVoiceChannelId: string = "";
    private emoji: Array<string> = [""];
    private otherMessageString: Array<string> = [""];
    private formatUserIdTag: RegExp = /<userId>/g;
    private formatUserNameTag: RegExp = /<userName>/g;
    private formatChannelIdTag: RegExp = /<channelId>/g;
    private formatEmojiTag: RegExp = /<emoji>/;
    private formatOtherMessageStringTag: RegExp = /<otherMsg>/;

    /**
     * Format message string.
     * @param sendMessageFormatUtilsOption Format option.
     */
    constructor(sendMessageFormatUtilsOption?: SendMessageFormatUtilsOption) {
        if (sendMessageFormatUtilsOption === undefined) return;
        if (sendMessageFormatUtilsOption.mentions != undefined) {
            this.mentionsUserId = sendMessageFormatUtilsOption.mentions?.userId;
            this.mentionsUserName = sendMessageFormatUtilsOption.mentions.userName;
            this.mentionsVoiceChannelId = sendMessageFormatUtilsOption.mentions.channelId;
        };
        if (sendMessageFormatUtilsOption.formatTag != undefined) {
            this.formatUserIdTag = new RegExp(sendMessageFormatUtilsOption.formatTag?.userId, 'g');
            this.formatUserNameTag = new RegExp(sendMessageFormatUtilsOption.formatTag?.userName, 'g');
            this.formatChannelIdTag = new RegExp(sendMessageFormatUtilsOption.formatTag.channelId, 'g');
            if (sendMessageFormatUtilsOption.formatTag.emoji != undefined)
                this.formatEmojiTag = new RegExp(sendMessageFormatUtilsOption.formatTag.emoji);
            if (sendMessageFormatUtilsOption.formatTag.otherMessage != undefined)
                this.formatOtherMessageStringTag = new RegExp(sendMessageFormatUtilsOption.formatTag.otherMessage);
        };
    };

    /**
     * Set mentions user id.
     */
    set setMentionsUserId(id: string) {
        this.mentionsUserId = id;
    };

    /**
     * Set mentions user name.
     */
    set setMentionsUserName(name: string) {
        this.mentionsUserName = name;
    };

    /**
     * Set mention channel id.
     */
    set setMentionsVoiceChannel(id: string) {
        this.mentionsVoiceChannelId = id;
    };

    /**
     * Set emoji id.
     */
    set setEemoji(emoji: Array<string>) {
        this.emoji = emoji;
    }

    /**
     * Set other message.
     */
    set setOtherMessageString(message: Array<string>) {
        this.otherMessageString = message;
    };

    /**
     * Set user id format tag.
     */
    set setFormatUserIdTag(userIdTag: string) {
        this.formatUserIdTag = new RegExp(userIdTag, 'g');
    };

    /**
     * Set user name format tag.
     */
    set setFormatUserNameTag(userNameTag: string) {
        this.formatUserNameTag = new RegExp(userNameTag, 'g');
    };

    /**
     * Set channel id format tag.
     */
    set setChannelIdTag(channelIdTag: string) {
        this.formatChannelIdTag = new RegExp(channelIdTag, 'g')
    };

    /**
     * Set channel id format tag.
     */
    set setEmojiTag(emojiTag: string) {
        this.formatEmojiTag = new RegExp(emojiTag)
    };

    /**
     * Set other message format tag.
     */
    set setfOrmatOtherMessageStringTag(formatOtherMessageStringTag: string) {
        this.formatOtherMessageStringTag = new RegExp(formatOtherMessageStringTag)
    };

    /**
     * Remove "formatStringTag" in string.
     * @param message Input string.
     * @param formatStringPool Format tag pool.
     * @param formatStringTag Format tag.
     * @returns String with formatting tags removed.
     */
    private formatMultipleTag(message: string, formatStringPool: string[], formatStringTag: RegExp): string {
        if (formatStringPool.length != 0) {
            for (const iterator of formatStringPool) {
                if (message.search(formatStringTag) === -1) continue;
                message = message.replace(formatStringTag, iterator);
            }
            // remove 'message format tag'
            while (message.search(formatStringTag) != -1) {
                message = message.replace(formatStringTag, "");
            }
        } else if (formatStringPool.length === 0 || formatStringPool === undefined) {
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
    public formatString(message: string): string {
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
    };
};