import {GamePad} from "./gamePads/GamePad.js";
import {ErrorMouseControllerAlreadyExists} from '../error/CustomErrors.js';
import {EVENT_NAMES, KEY_CODES} from '../constants/constants.js';
import {ErrorInvalidEventType} from '../error/CustomErrors';

let controllerCreated = false;

/**
 * A controller class for describing mouse event handlers .
 * Class MouseController
 */
export class MouseController extends GamePad {
    /**
     * Constructor
     * @param {THREE.Scene} scene Required - the scene where the controller will be used.
     * @param {THREE.PerspectiveCamera, THREE.OrthographicCamera} camera Required - the camera where the controller will be used.
     */
    constructor(scene = null, camera = null) {
        if (controllerCreated) {
            throw new ErrorMouseControllerAlreadyExists();
        }
        controllerCreated = true;
        super("mouse", null, scene, camera, 1);

        this.setRaycasterScene(scene);
        this.setRaycasterCamera(camera);

    }


    /**
     * Get raycasted objects ({distance, point, face, faceIndex, indices, object}) that are under mouse pointer.
     * @param {MouseController} controller
     * @returns [Object]
     */
    getIntersections(controller) {
        this.raycaster.setFromCamera(new THREE.Vector2(controller.axes[0], controller.axes[1]), this.camera);
        return this.raycaster.raycast();
    }
    /**
     * Custom function to be triggered when mouse pointer hovers any raycastable element.
     * @param {Object} intersect - intersected object ({distance, point, face, faceIndex, indices, object}) at the time of event.
     */
    gamepadHover(intersect) {
    }
    /**
     * Custom function to be triggered when mouse pointer hovers out of any raycastable element.
     */
    gamepadHoverOut() {
    }

    /**
     * Get Gamepad from navigator.
     * @returns {MouseGamePad}
     */
    static getGamepad() {
        return navigator.mouseGamePad;
    }

    /**
     * Set propagation value for standard events, recommended, when using custom handlers on mousedown/mouseup/mousemove/scroll.
     * @param {string} eventName - 'mousedown', 'mouseup', mousemove', 'mousewheel'.
     * @param {boolean} value - true, false
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
     * Start propagation for event.
     * @param eventName
     */
    startPropagation(eventName) {
        this.setPropagation(eventName, true);
    }

    /**
     * Stop propagation for event.
     * @param eventName
     */
    stopPropagation(eventName) {
        this.setPropagation(eventName, false);
    }

    /**
     * Get the mouse coordinates.
     * @returns {Array}
     */
    get axes() {
        return MouseController.getGamepad().axes;
    }

    /**
     * Mouse down event handler.
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
     * Mouse up event handler.
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