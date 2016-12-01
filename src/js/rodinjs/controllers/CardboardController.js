import {GamePad} from "./gamePads/GamePad.js";
import {ErrorCardboardControllerAlreadyExists} from '../error/CustomErrors.js';
import {EVENT_NAMES, KEY_CODES} from '../constants/constants.js';
import {ErrorInvalidEventType} from '../error/CustomErrors';

let controllerCreated = false;

/**
 * Class CardboardController
 */
export class CardboardController extends GamePad {
    constructor(scene = null, camera = null) {
        if (controllerCreated) {
            throw new ErrorCardboardControllerAlreadyExists();
        }
        controllerCreated = true;
        super("cardboard", null, scene, camera, 2);

        this.setRaycasterScene(scene);
        this.setRaycasterCamera(camera);
        this.disable();

        window.addEventListener('vrdisplaypresentchange', (e) => {
            let re = new RegExp('cardboard', 'gi');
            if (e.detail && e.detail.display && re.test(e.detail.display.displayName)) {
                e.detail.display.isPresenting ? this.enable() : this.disable();
            }
        }, true);
    }

    /**
     * getIntersections method
     * @returns [Sculpt]
     */
    getIntersections() {
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }

    /**
     * Set propagation value for event.
     * @param eventName {string}
     * @param value {boolean}
     */
    setPropagation(eventName, value) {
        let gamePad = CardboardController.getGamepad();
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
        }

        throw new ErrorInvalidEventType(eventName, 'setPropagation');
    }

    /**
     * start propagation for event
     * @param eventName {string}
     */
    startPropagation(eventName) {
        this.setPropagation(eventName, true);
    }

    /**
     * stop propagation for event
     * @param eventName {string}
     */
    stopPropagation(eventName) {
        this.setPropagation(eventName, false);
    }

    /**
     * OnKeyDown function
     * @param keyCode {number}
     */
    onKeyDown(keyCode) {

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
     * OnKeyUp function
     * @param keyCode {number}
     */
    onKeyUp(keyCode) {
        this.engaged = false;
        this.pickedItems = [];
        this.keyCode = null;

        this.startPropagation(EVENT_NAMES.MOUSE_DOWN);
        this.startPropagation(EVENT_NAMES.MOUSE_MOVE);
    }

    /**
     * get gamepad from navigator
     * @returns {MouseGamePad}
     */
    static getGamepad() {
        return navigator.cardboardGamePad;
    }
}