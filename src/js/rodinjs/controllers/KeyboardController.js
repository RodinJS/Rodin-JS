import {GamePad} from './gamePads/GamePad.js';
import {ErrorKeyboardControllerAlreadyExists} from '../error/CustomErrors.js';
import {Objects} from '../objects.js';
import {Event} from '../Event.js';
import {EVENT_NAMES} from '../constants/constants.js';
import {Set} from '../utils/Set.js';

let controllerCreated = false;
let keys = new Set();

export class KeyboardController extends GamePad {
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
     * Overwrite all functions.
     * This need for interface
     */
    setRaycasterScene () {
    }

    setRaycasterCamera () {
    }

    update () {
    }

    updateObject () {
    }

    intersectObjects () {
    }

    /**
     * @param {string} eventName
     * @param {*} DOMEvent
     * @param {number} keyCode
     * @param {GamePad} controller
     */
    raycastAndEmitEvent (eventName, DOMEvent, keyCode, controller = this) {
        Objects.map(object => {
            let evt = new Event(object.object3D.Sculpt, DOMEvent, keyCode, null, controller);
            // evt.keys = [...keys];
            object.object3D.Sculpt.emit(eventName, evt);
        });
    }

    get axes () {
    }

    static getKey (keyCode) {
        return keys.indexOf(keyCode) !== -1;
    }
}
