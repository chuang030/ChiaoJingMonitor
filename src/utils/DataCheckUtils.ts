export enum LogicalOperators { '&&', '||' };
export class DataCheckUtils {

    private data: any;
    private referenceData: any;

    /**
     * Input any data.
     * @param data Any data.
     * @param referenceData Any reference data.
     */
    constructor(data?: any, referenceData?: any) {
        this.data = data;
        this.referenceData = referenceData;
    };

    /**
     * Input any data.
     * @param data Any data.
     * @param referenceData Any reference data.
     */
    public inputData(data: any, referenceData?: any): void {
        this.data = data;
        this.referenceData = referenceData;
    };

    /**
     * Check data is null\
     * If data type is null, undefined, null string, null array, null object, judged to be null.
     * @returns Judged result.
     */
    public isNullData(): boolean {
        if (typeof this.data != 'undefined' && this.data === null) {
            return true;
        };
        if (typeof this.data === 'string' && this.data === "") {
            return true;
        };
        if (typeof this.data === 'object' && Object.keys(this.data).length === 0) {
            return true;
        };
        return false;
    };

    /**
     * Check content is the same for data\
     * Compare two data, return true if they are the same, and return false if they are different.
     * @returns Judged result.
     */
    public isSameData(): boolean {
        let isSame: boolean = false;
        switch (typeof this.referenceData) {
            case 'number':
            case 'string':
            case 'boolean':
            case 'undefined':
                isSame = this.data === this.referenceData;
            case 'object':

                // judged is array
                if (this.data instanceof Array && this.referenceData instanceof Array) {
                    const array1 = Object.assign([], this.data);
                    const array2 = Object.assign([], this.referenceData);
                    if (array1.length != array2.length) {
                        isSame = false;
                        break;
                    }
                    for (let i = 0; i < array2.length; i++) {
                        if (array1[i] != array2[i]) {
                            isSame = false;
                            break;
                        }
                    }
                    isSame = true;
                    break;
                } else if (this.data instanceof Array != this.referenceData instanceof Array) {
                    isSame = false;
                    break;
                };

                // judged is object
                const object1: object = Object.assign({}, this.data);
                const object2: object = Object.assign({}, this.referenceData);

                // judged properties count and name it's the same, if not the same, return false.
                if (Object.keys(this.data).length != Object.keys(this.referenceData).length) {
                    isSame = false;
                    break;
                };
                // judged properties name it's the same, if not the same, return false.
                if (JSON.stringify(Object.keys(object1)) === JSON.stringify(Object.keys(object2))) {
                    // judged properties value it's the same, if not the same, return false.
                    if (JSON.stringify(Object.values(object1)) === JSON.stringify(Object.values(object2))) {
                        isSame = true;
                    }
                } else {
                    isSame = false;
                };
                break;
        };
        return isSame;
    };

    /**
     * Check if the input data is empty.
     * @param data Any data.
     * @returns Judged result.
     */
    public judgedDataIsNull(data: any): boolean {
        this.inputData(data);
        return this.isNullData();
    };

    /**
     * Determine whether multiple input data is empty.
     * @param data Any data.
     * @returns Judged result array.
     * @example
     * const dataCheckUtils = new DataCheckUtils;
     * let i = null;
     * let j = 0;
     * dataCheckUtils.judgedMultipleDataIsNull(i, j);
     * // return [true, false]
     */
    public judgedMultipleDataIsNull(...data: any[]): boolean[] {
        let resultArray: Array<boolean> = [];
        data.forEach(element => {
            resultArray.push(this.judgedDataIsNull(element));
        });
        return resultArray;
    };

    /**
     * A logical operators controller.
     * @param logicalOperators Logical operators.
     * @param resultArray Result array.
     * @returns Result value.
     * @example
     * ```ts
     * public anyFun(logicalOperators: LogicalOperators,resultArray: Array<boolean>): boolean {
     *      return this.logicalOperatorsController(logicalOperators,resultArray);
     * }
     * ```
     */
    private logicalOperatorsController
        (logicalOperators: LogicalOperators, resultArray: Array<boolean>): boolean {
        let resultBoolean: boolean = false;
        switch (logicalOperators) {
            default:
            case LogicalOperators["&&"]:
                if (!resultArray.includes(false)) resultBoolean = true;
                break;
            case LogicalOperators["||"]:
                if (resultArray.includes(true)) resultBoolean = true;
                break;
        };
        return resultBoolean;
    };

    /**
     * Determine whether multiple input data is empty, and judged the result with logical operators.
     * @param logicalOperators Logical operators.
     * @param data Any data.
     * @returns Judged result.
     * @example
     * ```ts
     * import { DataCheckUtils, LogicalOperators } from '../your_dir/dataCheckUtils';
     * const dataCheckUtils = new DataCheckUtils;
     * let i = null;
     * let j = 0;
     * dataCheckUtils.judgedMultipleDataIsNullResult(LogicalOperators['&&'], i, j);
     * // return false
     * ```
     */
    public judgedMultipleDataIsNullResult
        (logicalOperators: LogicalOperators, ...data: any[]): boolean {
        return this.logicalOperatorsController(logicalOperators, this.judgedMultipleDataIsNull(...data));
    };

    /**
     * Check if the input data is the same.
     * @param data Any data.
     * @param referenceData Any reference data.
     * @returns Judged result.
     */
    public judgedDataIsSame(data: any, referenceData: any): boolean {
        this.inputData(data, referenceData);
        return this.isSameData();
    };

    /**
     * Determine whether multiple input data is the same.
     * @param data Any data array.
     * @returns Judged result array.
     */
    public judgedMultipleDataIsSame(...data: any[]): boolean[] {
        let resultArray: Array<boolean> = [];
        data.forEach(element => {
            resultArray.push(this.judgedDataIsSame(element[0], element[1]));
        })
        return resultArray;
    };

    /**
     * Determine whether multiple input data is the same, and judged the result with logical operators.
     * @param logicalOperators Logical operators.
     * @param data Any data array.
     * @returns Judged result.
     * @example
     * ```ts
     * import { DataCheckUtils, LogicalOperators } from '../your_dir/dataCheckUtils';
     * const dataCheckUtils = new DataCheckUtils;
     *  let i = { a: 0, b: "" };
     *  let j = { a: 1, b: "" };
     *  let k = { a: 0, k: "" };
     * dataCheckUtils.judgedMultipleDataIsSameResult(LogicalOperators['&&'], [i,j], [k, k]);
     * // return false
     * dataCheckUtils.judgedMultipleDataIsSameResult(LogicalOperators['||'], [i,j], [k, k]);
     * // return true
     * ```
     */
    public judgedMultipleDataIsSameResult
        (logicalOperators: LogicalOperators, ...data: any[]): boolean {
        return this.logicalOperatorsController(logicalOperators, this.judgedMultipleDataIsSame(...data));
    };

    /**
     * Comparison boolean value in multiple input data, and judged the result with logical operators.
     * @param logicalOperators Logical operators.
     * @param booleanData Boolean data array.
     * @returns Judged result.
     * @example
     * ```ts
     * import { DataCheckUtils, LogicalOperators } from '../your_dir/dataCheckUtils';
     * const dataCheckUtils = new DataCheckUtils;
     * let i = 0;
     * let j = 1;
     * dataCheckUtils.judgedBooleanResult(LogicalOperators['&&'], i === j, i === 0);
     * // return false
     * dataCheckUtils.judgedBooleanResult(LogicalOperators['||'], i === j, i === 0);
     * // return true
     * ```
     */
    public judgedBooleanResult
        (logicalOperators: LogicalOperators, ...booleanData: boolean[]): boolean {
        return this.logicalOperatorsController(logicalOperators, booleanData);
    };
};

