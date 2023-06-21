type MessageAnalyzeUtilsOption = {
    analyzeUserIdTag: string,
    analyzeChannelIdTag: string,
    analyzeCustomEmojiTag: string,
    analyzeIdTag: string,
    analyzeCustomEmojiIdTag: string
};
type analyzeResult = {
    resultId: string,
    resultTag: string
};

export class MessageAnalyzeUtils {

    private analyzeUserIdTag: RegExp = /<@[0-9]*>/;
    private analyzeChannelIdTag: RegExp = /<#[0-9]*>/;
    private analyzeCustomEmojiTag: RegExp = /<:[A-Za-z0-9_]*:[0-9]*>/;
    private analyzeIdTag: RegExp = /[0-9]+/;
    private analyzeCustomEmojiIdTag: RegExp = /:[A-Za-z0-9_]*:[0-9]*/;
    private resultUserId: string = "";
    private resultChannelId: string = "";
    private resultCustomEmojiId: string = "";
    private resultUserTag: string = "";
    private resultChannelTag: string = "";
    private resultCustomEmojiTag: string = "";

    constructor(messageAnalyzeUtilsOption?: MessageAnalyzeUtilsOption) {
        if (messageAnalyzeUtilsOption != undefined) {
            this.analyzeUserIdTag = new RegExp(messageAnalyzeUtilsOption.analyzeUserIdTag);
            this.analyzeChannelIdTag = new RegExp(messageAnalyzeUtilsOption.analyzeChannelIdTag);
            this.analyzeCustomEmojiTag = new RegExp(messageAnalyzeUtilsOption.analyzeCustomEmojiTag);
            this.analyzeIdTag = new RegExp(messageAnalyzeUtilsOption.analyzeIdTag);
            this.analyzeCustomEmojiIdTag = new RegExp(messageAnalyzeUtilsOption.analyzeCustomEmojiIdTag);
        }
    };

    set setAnalyzeUserIdTag(analyzeUserIdTag: string) {
        this.analyzeUserIdTag = new RegExp(analyzeUserIdTag);
    };

    set setAnalyzeChannelIdTag(analyzeChannelIdTag: string) {
        this.analyzeChannelIdTag = new RegExp(analyzeChannelIdTag);
    };

    set setAnalyzeCustomEmojiTag(analyzeCustomEmojiTag: string) {
        this.analyzeCustomEmojiTag = new RegExp(analyzeCustomEmojiTag);
    };

    set setAnalyzeIdTag(analyzeIdTag: string) {
        this.analyzeIdTag = new RegExp(analyzeIdTag);
    };

    set setAnalyzeCustomEmojiIdTag(analyzeCustomEmojiIdTag: string) {
        this.analyzeCustomEmojiIdTag = new RegExp(analyzeCustomEmojiIdTag);
    };

    get getResultUserId(): string {
        return this.resultUserId;
    };

    get getResultChannelId(): string {
        return this.resultChannelId;
    };

    get getResultCustomEmojiId(): string {
        return this.resultCustomEmojiId;
    };

    get getResultUserTag(): string {
        return this.resultUserTag;
    };

    get getResultChannelTag(): string {
        return this.resultChannelTag;
    };

    get getResultCustomEmojiTag(): string {
        return this.resultCustomEmojiTag;
    };

    /**
     * Analyze original string to result string.
     * @param message Analyze string.
     * @param analyzeTag Analyze Tag.
     * @returns Result string.
     */
    private matchTarget(message: string, analyzeTag: RegExp): analyzeResult {
        const resultTag = message.match(analyzeTag);
        if (resultTag != null) {
            if (analyzeTag === this.analyzeCustomEmojiTag) {
                const resultId = resultTag[0].match(this.analyzeCustomEmojiIdTag);
                if (resultId != null) return {
                    resultId: resultId[0],
                    resultTag: resultTag[0]
                };
            };
            const resultId = resultTag[0].match(this.analyzeIdTag);
            if (resultId != null) return {
                resultId: resultId[0],
                resultTag: resultTag[0]
            };
        };
        return {
            resultId: "",
            resultTag: ""
        };
    };

    /**
     * Analyze of input string.
     * @param message Analyze string.
     */
    public analyzeString(message: string): void {
        if (message.search(this.analyzeUserIdTag) >= 0) {
            const result = this.matchTarget(message, this.analyzeUserIdTag);
            this.resultUserId = result.resultId;
            this.resultUserTag = result.resultTag;
        }else {
            this.resultUserId = "";
            this.resultUserTag = "";
        };
        if (message.search(this.analyzeChannelIdTag) >= 0) {
            const result = this.matchTarget(message, this.analyzeChannelIdTag);
            this.resultChannelId = result.resultId;
            this.resultChannelTag = result.resultTag;
        }else {
            this.resultChannelId = "";
            this.resultChannelTag = "";
        };
        if (message.search(this.analyzeCustomEmojiTag) >= 0) {
            const result = this.matchTarget(message, this.analyzeCustomEmojiTag);
            this.resultCustomEmojiId = result.resultId;
            this.resultCustomEmojiTag = result.resultTag;
        }else {
            this.resultCustomEmojiId = "";
            this.resultCustomEmojiTag = "";
        };
    };
};