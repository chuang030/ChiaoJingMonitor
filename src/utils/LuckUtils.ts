import { MathUtils } from './MathUtils';

type divinationOption = {
    divinationLevel: Array<string>
};

export class LuckUtils extends MathUtils {
    private divinationLevel: Array<string> = [""];

    /**
     * Divination utils.
     * @param divinationOption divination option.
     */
    constructor(divinationOption?: divinationOption) {
        super();
        if (divinationOption != undefined)
            this.divinationLevel = divinationOption.divinationLevel;
    };

    /**
     * Set divination level
     */
    set setDivinationLevel(divinationLevel: Array<string>) {
        this.divinationLevel = divinationLevel;
    };

    /**
     * Gets divination level
     */
    get getDivinationLevel(): Array<string> {
        return this.divinationLevel;
    }

    /**
     * Gets divination value.
     * @param index Divination level array index.
     * @returns Divination value.
     */
    public getDivination(index: number) {
        return this.divinationLevel[index];
    };
};