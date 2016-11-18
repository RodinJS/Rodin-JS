import {GamePad} from "./gamePads/GamePad.js";
import {ErrorCardboardControllerAlreadyExists} from '../error/CustomErrors.js';
import {EVENT_NAMES} from '../constants/constants.js';
import {ErrorInvalidEventType} from '../error/CustomErrors';

let controllerCreated = false;

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

        window.addEventListener('vrdisplaypresentchange', (e)=> {
            let re = new RegExp('cardboard', 'gi');
            if (e.detail && e.detail.display && re.test(e.detail.display.displayName)) {
                e.detail.display.isPresenting ? this.enable() : this.disable();
            }
        }, true);
    }

    getIntersections() {
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }

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

    startPropagation(eventName) {
        this.setPropagation(eventName, true);
    }

    stopPropagation(eventName) {
        this.setPropagation(eventName, false);
    }

    static getGamepad() {
        return navigator.cardboardGamePad;
    }
}