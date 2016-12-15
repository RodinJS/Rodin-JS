import {GamePad} from "./gamePads/GamePad.js";
import {ErrorCardboardControllerAlreadyExists} from '../error/CustomErrors.js';
import {EVENT_NAMES, KEY_CODES} from '../constants/constants.js';
import {ErrorInvalidEventType} from '../error/CustomErrors';

let controllerCreated = false;

/**
 * A controller class for describing event handlers for cardboard use.
 * Class CardboardController
 */
export class CardboardController extends GamePad {
    /**
     * Constructor
     * @param {THREE.Scene} scene Required - the scene where the controller will be used.
     * @param {THREE.PerspectiveCamera} camera Required - the camera where the controller will be used.
     */
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
     * Get raycasted objects ({distance, point, face, faceIndex, indices, object}) that are in camera's center.
     * @returns [Object]
     */
    getIntersections() {
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }

    /**
     * Set propagation value for standard events, recommended, when using custom handlers on mousedown(touchstart) or mouseup(touchend).
     * @param {string} eventName - 'mousedown', 'mouseup', mousemove'.
     * @param {boolean} value - true, false.
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
     * Start propagation for event.
     * @param eventName {string}
     */
    startPropagation(eventName) {
        this.setPropagation(eventName, true);
    }

    /**
     * Stop propagation for event.
     * @param eventName {string}
     */
    stopPropagation(eventName) {
        this.setPropagation(eventName, false);
    }

    /**
     * Key down (cardboard button press) event handler.
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
     * Key up (cardboard button up) event handler.
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
     * Get gamepad from navigator.
     * @returns {CardboardGamePad}
     */
    static getGamepad() {
        return navigator.cardboardGamePad;
    }
}