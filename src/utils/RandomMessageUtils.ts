import { MathUtils } from './MathUtils';
export class RandomMessageUtils extends MathUtils {

    constructor() {
        super();
    };

    private messagePool: Array<string> = [""];
    private emojiPool: Array<string> = [""];

    set setMessagePool(messagePool: Array<string>) {
        this.messagePool = messagePool;
    };

    get getMessagePool(): string[] {
        return this.messagePool;
    };

    set setEmojiPool(emojiPool: Array<string>) {
        this.emojiPool = emojiPool;
    };

    get getEmojiPool(): string[] {
        return this.emojiPool;
    };

    public getRandomMessage(): string {
        return this.getMessagePool[this.getRandom(0, this.getMessagePool.length - 1)];
    };

    public getRandomEmoji(): string {
        return this.getEmojiPool[this.getRandom(0, this.getEmojiPool.length - 1)];
    };
};