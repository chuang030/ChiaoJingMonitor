"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomMessageUtils = void 0;
const MathUtils_1 = require("./MathUtils");
class RandomMessageUtils extends MathUtils_1.MathUtils {
    constructor() {
        super();
        this.messagePool = [""];
        this.emojiPool = [""];
    }
    ;
    set setMessagePool(messagePool) {
        this.messagePool = messagePool;
    }
    ;
    get getMessagePool() {
        return this.messagePool;
    }
    ;
    set setEmojiPool(emojiPool) {
        this.emojiPool = emojiPool;
    }
    ;
    get getEmojiPool() {
        return this.emojiPool;
    }
    ;
    getRandomMessage() {
        return this.getMessagePool[this.getRandom(0, this.getMessagePool.length - 1)];
    }
    ;
    getRandomEmoji() {
        return this.getEmojiPool[this.getRandom(0, this.getEmojiPool.length - 1)];
    }
    ;
}
exports.RandomMessageUtils = RandomMessageUtils;
;
