
export class DataProcessingUtils {

    constructor() { };

    public zeroReplenish(number: number) {
        if (number < 10) return `0${number}`
        return number;
    };

}


export class DateFormat extends Date {
    constructor() {
        super()
    };

    public zeroReplenish(number: number) {
        if (number < 10) return `0${number}`
        return number;
    };

    get getFullDateSeconds(): string {
        return `${this.getFullYear()}${this.zeroReplenish(this.getMonth() + 1)}${this.zeroReplenish(this.getDate())}` +
            `${this.zeroReplenish(this.getHours())}${this.zeroReplenish(this.getMinutes())}${this.zeroReplenish(this.getSeconds())}`;
    };

    get getFullDatetMinutes(): string {
        return `${this.getFullYear()}${this.zeroReplenish(this.getMonth() + 1)}${this.zeroReplenish(this.getDate())}` +
            `${this.zeroReplenish(this.getHours())}${this.zeroReplenish(this.getMinutes())}`;
    };

    get getFullDateHours(): string {
        return `${this.getFullYear()}${this.zeroReplenish(this.getMonth() + 1)}${this.zeroReplenish(this.getDate())}` +
            `${this.zeroReplenish(this.getHours())}`;
    };

    get getFullDate(): string {
        return `${this.getFullYear()}${this.zeroReplenish(this.getMonth() + 1)}${this.zeroReplenish(this.getDate())}`;
    };
}