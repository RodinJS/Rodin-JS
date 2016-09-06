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

export class EVENT_NAMES extends PARAMS {
    constructor() {
        super();
    }

    static READY = 'ready';
    static UPDATE = 'update';

    static HOVER = 'hover';
    static HOVER_OUT = 'hoverout';
    static MOUSE_DOWN = 'mousedown';
    static MOUSE_UP = 'mouseup';
    static MOUSE_ENTER = 'mouseeter';
    static MOUSE_LEAVE = 'mouseleave';
    static CLICK = 'click';
    static RIGHT_CLICK = 'rightclick';

    static STEREO_HOVER = 'stereohover';
    static STEREO_HOVER_OUT = 'stereohoverout';
    static STEREO_MOUSE_DOWN = 'stereomousedown';
    static STEREO_MOUSE_UP = 'stereomouseup';
    static STEREO_CLICK = 'stereoclick';

    static TOUCH_START = 'touchstart';
    static TOUCH_END = 'touchend';
    static TAP = 'tap';

    static CONTROLLER_HOVER = 'controllerhover';
    static CONTROLLER_HOVER_OUT = 'controllerhoverout';
}
