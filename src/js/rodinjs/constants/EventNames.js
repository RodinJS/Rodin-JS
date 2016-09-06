import {PARAMS} from './Params.js';

const _READY = 'ready';
const _UPDATE = 'update';

const _HOVER = 'hover';
const _HOVER_OUT = 'hoverout';
const _MOUSE_DOWN = 'mousedown';
const _MOUSE_UP = 'mouseup';
const _MOUSE_ENTER = 'mouseeter';
const _MOUSE_LEAVE = 'mouseleave';
const _CLICK = 'click';
const _RIGHT_CLICK = 'rightclick';

const _STEREO_HOVER = 'stereohover';
const _STEREO_HOVER_OUT = 'stereohoverout';
const _STEREO_MOUSE_DOWN = 'stereomousedown';
const _STEREO_MOUSE_UP = 'stereomouseup';
const _STEREO_CLICK = 'stereoclick';

const _TOUCH_START = 'touchstart';
const _TOUCH_END = 'touchend';
const _TAP = 'tap';

const _CONTROLLER_HOVER = 'controllerhover';
const _CONTROLLER_HOVER_OUT = 'controllerhoverout';

const _CONTROLLER_KEY_DOWN = 'controllerkeydown';
const _CONTROLLER_KEY_UP = 'controllerkeyup';
const _CONTROLLER_CLICK = 'controllerclick';

const _CONTROLLER_TOUCH_START = 'controllertouchstart';
const _CONTROLLER_TOUCH_END = 'controllertouchend';
const _CONTROLLER_TAP = 'controllertap';

export class EVENT_NAMES extends PARAMS {
    constructor() {
        super();
    }

    /**
     * @returns {string}
     */
    static get READY() {
        return _READY;
    };

    /**
     * @returns {string}
     */
    static get UPDATE() {
        return _UPDATE;
    }

    /**
     * @returns {string}
     */
    static get HOVER() {
        return _HOVER;
    }

    /**
     * @returns {string}
     */
    static get HOVER_OUT() {
        return _HOVER_OUT;
    };

    /**
     * @returns {string}
     */
    static get MOUSE_DOWN() {
        return _MOUSE_DOWN;
    };

    /**
     * @returns {string}
     */
    static get MOUSE_UP() {
        return _MOUSE_UP;
    };

    /**
     * @returns {string}
     */
    static get MOUSE_ENTER() {
        return _MOUSE_ENTER;
    }

    /**
     * @returns {string}
     */
    static get MOUSE_LEAVE() {
        return _MOUSE_LEAVE;
    };

    /**
     * @returns {string}
     */
    static get CLICK() {
        return _CLICK;
    };

    /**
     * @returns {string}
     */
    static get RIGHT_CLICK() {
        return _RIGHT_CLICK;
    };

    /**
     * @returns {string}
     */
    static get STEREO_HOVER() {
        return _STEREO_HOVER;
    };

    /**
     * @returns {string}
     */
    static get STEREO_HOVER_OUT() {
        return _STEREO_HOVER_OUT;
    };

    /**
     * @returns {string}
     */
    static get STEREO_MOUSE_DOWN() {
        return _STEREO_MOUSE_DOWN;
    };

    /**
     * @returns {string}
     */
    static get STEREO_MOUSE_UP() {
        return _STEREO_MOUSE_UP;
    };

    /**
     * @returns {string}
     */
    static get STEREO_CLICK() {
        return _STEREO_CLICK;
    };

    /**
     * @returns {string}
     */
    static get TOUCH_START() {
        return _TOUCH_START;
    };

    /**
     * @returns {string}
     */
    static get TOUCH_END() {
        return _TOUCH_END;
    };

    /**
     * @returns {string}
     */
    static get TAP() {
        return _TAP;
    };

    /**
     * @returns {string}
     */
    static get CONTROLLER_HOVER() {
        return _CONTROLLER_HOVER;
    };

    /**
     * @returns {string}
     */
    static get CONTROLLER_HOVER_OUT() {
        return _CONTROLLER_HOVER_OUT;
    };

    /**
     * @returns {string}
     */
    static get CONTROLLER_KEY_DOWN() {
        return _CONTROLLER_KEY_DOWN;
    };

    /**
     * @returns {string}
     */
    static get CONTROLLER_KEY_UP() {
        return _CONTROLLER_KEY_UP;
    };

    /**
     * @returns {string}
     */
    static get CONTROLLER_CLICK() {
        return _CONTROLLER_CLICK;
    };

    /**
     * @returns {string}
     */
    static get CONTROLLER_TOUCH_START() {
        return _CONTROLLER_TOUCH_START;
    };

    /**
     * @returns {string}
     */
    static get CONTROLLER_TOUCH_END() {
        return _CONTROLLER_TOUCH_END;
    };

    /**
     * @returns {string}
     */
    static get CONTROLLER_TAP() {
        return _CONTROLLER_TAP;
    };
}
