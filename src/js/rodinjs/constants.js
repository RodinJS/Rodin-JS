'use strict';

import { ErrorMAPClassInstance } from './error/CustomErrors.js';

/**
 * env variables
 */
export const env_mode = "development";

class PARAMS {
    constructor() {
        throw new ErrorMAPClassInstance();
    }
}

export class ANIMATION_TYPES extends PARAMS {
    constructor() {
        super();
    }

    static SCALE = 'scale';
    static POSITION = 'position';
    static ROTATION = 'rotation';
}
