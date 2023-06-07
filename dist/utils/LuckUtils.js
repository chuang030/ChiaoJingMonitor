"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuckUtils = void 0;
const MathUtils_1 = require("./MathUtils");
class LuckUtils extends MathUtils_1.MathUtils {
    /**
     * Divination utils.
     * @param divinationOption divination option.
     */
    constructor(divinationOption) {
        super();
        this.divinationLevel = [""];
        if (divinationOption != undefined)
            this.divinationLevel = divinationOption.divinationLevel;
    }
    ;
    /**
     * Set divination level
     */
    set setDivinationLevel(divinationLevel) {
        this.divinationLevel = divinationLevel;
    }
    ;
    /**
     * Gets divination level
     */
    get getDivinationLevel() {
        return this.divinationLevel;
    }
    /**
     * Gets divination value.
     * @param index Divination level array index.
     * @returns Divination value.
     */
    getDivination(index) {
        return this.divinationLevel[index];
    }
    ;
}
exports.LuckUtils = LuckUtils;
;
