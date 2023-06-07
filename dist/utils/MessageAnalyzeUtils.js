"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageAnalyzeUtils = void 0;
class MessageAnalyzeUtils {
    constructor(messageAnalyzeUtilsOption) {
        this.analyzeUserIdTag = /<@[0-9]*>/;
        this.analyzeChannelIdTag = /<#[0-9]*>/;
        this.analyzeCustomEmojiTag = /<:[A-Za-z0-9_]*:[0-9]*>/;
        this.analyzeIdTag = /[0-9]+/;
        this.analyzeCustomEmojiIdTag = /:[A-Za-z0-9_]*:[0-9]*/;
        this.resultUserId = "";
        this.resultChannelId = "";
        this.resultCustomEmojiId = "";
        this.resultUserTag = "";
        this.resultChannelTag = "";
        this.resultCustomEmojiTag = "";
        if (messageAnalyzeUtilsOption != undefined) {
            this.analyzeUserIdTag = new RegExp(messageAnalyzeUtilsOption.analyzeUserIdTag);
            this.analyzeChannelIdTag = new RegExp(messageAnalyzeUtilsOption.analyzeChannelIdTag);
            this.analyzeCustomEmojiTag = new RegExp(messageAnalyzeUtilsOption.analyzeCustomEmojiTag);
            this.analyzeIdTag = new RegExp(messageAnalyzeUtilsOption.analyzeIdTag);
            this.analyzeCustomEmojiIdTag = new RegExp(messageAnalyzeUtilsOption.analyzeCustomEmojiIdTag);
        }
    }
    ;
    set setAnalyzeUserIdTag(analyzeUserIdTag) {
        this.analyzeUserIdTag = new RegExp(analyzeUserIdTag);
    }
    ;
    set setAnalyzeChannelIdTag(analyzeChannelIdTag) {
        this.analyzeChannelIdTag = new RegExp(analyzeChannelIdTag);
    }
    ;
    set setAnalyzeCustomEmojiTag(analyzeCustomEmojiTag) {
        this.analyzeCustomEmojiTag = new RegExp(analyzeCustomEmojiTag);
    }
    ;
    set setAnalyzeIdTag(analyzeIdTag) {
        this.analyzeIdTag = new RegExp(analyzeIdTag);
    }
    ;
    set setAnalyzeCustomEmojiIdTag(analyzeCustomEmojiIdTag) {
        this.analyzeCustomEmojiIdTag = new RegExp(analyzeCustomEmojiIdTag);
    }
    ;
    get getResultUserId() {
        return this.resultUserId;
    }
    ;
    get getResultChannelId() {
        return this.resultChannelId;
    }
    ;
    get getResultCustomEmojiId() {
        return this.resultCustomEmojiId;
    }
    ;
    get getResultUserTag() {
        return this.resultUserTag;
    }
    ;
    get getResultChannelTag() {
        return this.resultChannelTag;
    }
    ;
    get getResultCustomEmojiTag() {
        return this.resultCustomEmojiTag;
    }
    ;
    matchTarget(message, analyzeTag) {
        const resultTag = message.match(analyzeTag);
        if (resultTag != null) {
            if (analyzeTag === this.analyzeCustomEmojiTag) {
                const resultId = resultTag[0].match(this.analyzeCustomEmojiIdTag);
                if (resultId != null)
                    return {
                        resultId: resultId[0],
                        resultTag: resultTag[0]
                    };
            }
            ;
            const resultId = resultTag[0].match(this.analyzeIdTag);
            if (resultId != null)
                return {
                    resultId: resultId[0],
                    resultTag: resultTag[0]
                };
        }
        ;
        return {
            resultId: "",
            resultTag: ""
        };
    }
    ;
    analyzeString(message) {
        if (message.search(this.analyzeUserIdTag) >= 0) {
            const result = this.matchTarget(message, this.analyzeUserIdTag);
            this.resultUserId = result.resultId;
            this.resultUserTag = result.resultTag;
        }
        ;
        if (message.search(this.analyzeChannelIdTag) >= 0) {
            const result = this.matchTarget(message, this.analyzeChannelIdTag);
            this.resultChannelId = result.resultId;
            this.resultChannelTag = result.resultTag;
        }
        ;
        if (message.search(this.analyzeCustomEmojiTag) >= 0) {
            const result = this.matchTarget(message, this.analyzeCustomEmojiTag);
            this.resultCustomEmojiId = result.resultId;
            this.resultCustomEmojiTag = result.resultTag;
        }
        ;
    }
    ;
}
exports.MessageAnalyzeUtils = MessageAnalyzeUtils;
;
