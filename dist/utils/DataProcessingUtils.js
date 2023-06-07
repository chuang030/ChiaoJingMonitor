"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateFormat = exports.DataProcessingUtils = void 0;
class DataProcessingUtils {
    constructor() { }
    ;
    zeroReplenish(number) {
        if (number < 10)
            return `0${number}`;
        return number;
    }
    ;
}
exports.DataProcessingUtils = DataProcessingUtils;
class DateFormat extends Date {
    constructor() {
        super();
    }
    ;
    zeroReplenish(number) {
        if (number < 10)
            return `0${number}`;
        return number;
    }
    ;
    get getFullDateSeconds() {
        return `${this.getFullYear()}${this.zeroReplenish(this.getMonth() + 1)}${this.zeroReplenish(this.getDate())}` +
            `${this.zeroReplenish(this.getHours())}${this.zeroReplenish(this.getMinutes())}${this.zeroReplenish(this.getSeconds())}`;
    }
    ;
    get getFullDatetMinutes() {
        return `${this.getFullYear()}${this.zeroReplenish(this.getMonth() + 1)}${this.zeroReplenish(this.getDate())}` +
            `${this.zeroReplenish(this.getHours())}${this.zeroReplenish(this.getMinutes())}`;
    }
    ;
    get getFullDateHours() {
        return `${this.getFullYear()}${this.zeroReplenish(this.getMonth() + 1)}${this.zeroReplenish(this.getDate())}` +
            `${this.zeroReplenish(this.getHours())}`;
    }
    ;
    get getFullDate() {
        return `${this.getFullYear()}${this.zeroReplenish(this.getMonth() + 1)}${this.zeroReplenish(this.getDate())}`;
    }
    ;
}
exports.DateFormat = DateFormat;
