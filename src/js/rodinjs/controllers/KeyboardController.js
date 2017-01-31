import {GamePad} from './gamePads/GamePad.js';
import {ErrorKeyboardControllerAlreadyExists} from '../error/CustomErrors.js';
import {Objects} from '../objects.js';
import {RodinEvent} from '../RodinEvent.js';
import {EVENT_NAMES} from '../constants/constants.js';
import {Set} from '../utils/Set.js';

let controllerCreated = false;
let keys = new Set();
/**
 * A controller class for describing event handlers for keys.
 * Class KeyboardController
 */
    // TODO: cleanup and write comments
export class KeyboardController extends GamePad {
/**
 * Constructor
 */
    constructor () {
        if (controllerCreated) {
            throw new ErrorKeyboardControllerAlreadyExists();
        }

        controllerCreated = true;
        super();

        window.addEventListener('keydown', (evt) => {
            keys.push(evt.keyCode);
            this.raycastAndEmitEvent(EVENT_NAMES.GLOBALS.CONTROLLER_KEY_DOWN, evt, evt.keyCode, this);
        });

        window.addEventListener('keyup', (evt) => {
            keys.splice(keys.indexOf(evt.keyCode), 1);
            this.raycastAndEmitEvent(EVENT_NAMES.GLOBALS.CONTROLLER_KEY_UP, evt, evt.keyCode, this);
        })
    }

    /**
     * Bulk.
     */
    setRaycasterScene () {
    }

    /**
     * Bulk.
     */
    setRaycasterCamera () {
    }

    /**
     * Bulk.
     */
    update () {
    }

    /**
     * Bulk.
     */
    updateObject () {
    }

    /**
     * Bulk.
     */
    intersectObjects () {
    }

    /**
     * Emit global event for all objects.
     * @param {string} eventName
     * @param {DOMEvent} DOMEvent
     * @param {number} keyCode
     * @param {GamePad} [controller]
     */
    raycastAndEmitEvent (eventName, DOMEvent, keyCode, controller = this) {
        Objects.map(object => {
            let evt = new RodinEvent(object.object3D.Sculpt, DOMEvent, keyCode, null, controller);
            // evt.keys = [...keys];
            object.object3D.Sculpt.emit(eventName, evt);
        });
    }

    /**
     * Bulk.
     */
    get axes () {
    }

    /**
     * GetKey function
     * @param {number} keyCode
     * @returns {boolean} true if key pressed, false otherwise
     */
    static getKey (keyCode) {
        return keys.indexOf(keyCode) !== -1;
    }
}
