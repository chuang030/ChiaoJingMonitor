"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathUtils = void 0;
class MathUtils {
    /**
     * Math utils.
     */
    constructor() { }
    ;
    /**
     * 四捨五入
     * @param {Number} number 欲計算的值
     * @param {Number} [decimal] 取到小數點後多少位
     * @returns 計算完的值
     */
    round(number, decimal = 0) {
        return Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
    }
    /**
     * 無條件進位
     * @param {Number} number 欲計算的值
     * @param {Number} [decimal] 取到小數點後多少位
     * @returns 計算完的值
     */
    ceil(number, decimal = 0) {
        return Math.ceil(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
    }
    /**
     * 無條件捨去
     * @param {Number} number 欲計算的值
     * @param {Number} [decimal] 取到小數點後多少位
     * @returns 計算完的值
     */
    floor(number, decimal = 0) {
        return Math.floor(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
    }
    /**
     * 浮點數相加計算
     * @param  {...Number} number 欲計算的值
     * @returns 計算完的值
     */
    sumFloat(...number) {
        let value = 0;
        number.map(v => {
            value = parseFloat((value += v).toPrecision(12));
        });
        return value;
    }
    /**
     * Gets random number.
     * @param min Minimum value.
     * @param max Maximum value.
     * @returns Random number.
     */
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    ;
    /**
     * Get Random probability number.
     * @param decimal Decimal places.
     * @param number Probability distribution.
     * @returns Random probability result.
     * @example
     * ```ts
     * // The decimal places is 3
     * // So each value is 25000, 20000, 10000, 45000
     * // Get random value of 0 ~ total value.
     * // If random value is 21000. Return result is 0
     * // If random value is 25500. Return result is 1
     * getProbabilityRandom(3, 25, 20, 10, 45);
     * ```
     */
    getProbabilityRandom(decimal, ...number) {
        const denominator = Math.pow(10, Math.abs(decimal));
        let totalValue = 0;
        let addValue = 0;
        const probability = number.map(value => {
            totalValue = this.sumFloat(totalValue, value);
            addValue = totalValue * denominator;
            return addValue;
        });
        if (totalValue != 100)
            throw (new Error(`The value entered is not equal to 100, current value: ${totalValue}`));
        const randomValue = this.getRandom(0, addValue);
        for (let i = 0; i < probability.length; i++) {
            if (i === 0 && (randomValue <= probability[0]))
                return i;
            if (randomValue <= probability[i])
                return i;
        }
        return -1;
    }
    ;
}
exports.MathUtils = MathUtils;
;
