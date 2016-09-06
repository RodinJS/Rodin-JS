import {PARAMS} from './Params.js';

const _KEY1 = 1;
const _KEY2 = 2;
const _KEY3 = 3;
const _KEY4 = 4;

export class KEY_CODES extends PARAMS {
    constructor() {
        super();
    }

    /**
     * @returns {number}
     */
    static get KEY1() {
        return _KEY1;
    }

    /**
     * @returns {number}
     */
    static get KEY2() {
        return _KEY2;
    }

    /**
     * @returns {number}
     */
    static get KEY3() {
        return _KEY3;
    }

    /**
     * @returns {number}
     */
    static get KEY4() {
        return _KEY4;
    }
}