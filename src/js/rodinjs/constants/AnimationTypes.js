import {PARAMS} from './Params.js';

const _SCALE = 'scale';
const _POSITION = 'position';
const _ROTATION = 'rotation';

export class ANIMATION_TYPES extends PARAMS {
    constructor() {
        super();
    }

    /**
     * @returns {string}
     */
    static get SCALE() {
        return _SCALE;
    }

    /**
     * @returns {string}
     */
    static get POSITION() {
        return _POSITION;
    }

    /**
     * @returns {string}
     */
    static get ROTATION() {
        return _ROTATION;
    };
}