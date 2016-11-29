import {GamePad} from "./gamePads/GamePad.js";
import {ErrorMouseControllerAlreadyExists} from '../error/CustomErrors.js';
import {EVENT_NAMES, KEY_CODES} from '../constants/constants.js';
import {ErrorInvalidEventType} from '../error/CustomErrors';

let controllerCreated = false;

/**
 * Class MouseController
 */
export class MouseController extends GamePad {
    constructor(scene = null, camera = null) {
        if (controllerCreated) {
            throw new ErrorMouseControllerAlreadyExists();
        }
        controllerCreated = true;
        super("mouse", null, scene, camera, 2);

        this.setRaycasterScene(scene);
        this.setRaycasterCamera(camera);

    }


    /**
     * getIntersections override
     * @param controller {MouseController}
     * @returns [Sculpt]
     */
    getIntersections(controller) {
        this.raycaster.setFromCamera(new THREE.Vector2(controller.axes[0], controller.axes[1]), this.camera);
        return this.raycaster.raycast();
    }

    gamepadHover(intersect) {
    }

    gamepadHoverOut() {
    }

    /**
     * Get Gamepad from navigator
     * @returns {MouseGamePad}
     */
    static getGamepad() {
        return navigator.mouseGamePad;
    }

    /**
     * Set propagation for event
     * @param eventName {string}
     * @param value {boolean}
     */
    setPropagation(eventName, value) {
        let gamePad = MouseController.getGamepad();
        value = !value;

        switch (eventName) {
            case EVENT_NAMES.MOUSE_DOWN:
                gamePad.stopPropagationOnMouseDown = value;
                return;

            case EVENT_NAMES.MOUSE_UP:
                gamePad.stopPropagationOnMouseUp = value;
                return;

            case EVENT_NAMES.MOUSE_MOVE:
                gamePad.stopPropagationOnMouseMove = value;
                return;

            case EVENT_NAMES.MOUSE_WHEEL:
                gamePad.stopPropagationOnScroll = value;
                return;
        }

        throw new ErrorInvalidEventType(eventName, 'setPropagation');
    }

    /**
     * start propagation for event
     * @param eventName
     */
    startPropagation(eventName) {
        this.setPropagation(eventName, true);
    }

    /**
     * stop propagation for event
     * @param eventName
     */
    stopPropagation(eventName) {
        this.setPropagation(eventName, false);
    }

    /**
     * Get Axes
     * @returns {Array}
     */
    get axes() {
        return MouseController.getGamepad().axes;
    }

    /**
     * onKeyDown function
     * @param keyCode {number}
     */
    onKeyDown(keyCode) {
        if (keyCode === KEY_CODES.KEY2) return;
        this.keyCode = keyCode;
        this.engaged = true;
        if (!this.pickedItems) {
            this.pickedItems = [];
        }
        if (this.intersected && this.intersected.length > 0) {
            this.stopPropagation(EVENT_NAMES.MOUSE_DOWN);
            this.stopPropagation(EVENT_NAMES.MOUSE_MOVE);
        }
    }

    /**
     * onKeyUp function
     * @param keyCode {number}
     */
    onKeyUp(keyCode) {
        if (keyCode === KEY_CODES.KEY2) return;
        this.keyCode = null;
        this.engaged = false;
        this.startPropagation(EVENT_NAMES.MOUSE_DOWN);
        this.startPropagation(EVENT_NAMES.MOUSE_MOVE);
        this.pickedItems = [];
    }
}