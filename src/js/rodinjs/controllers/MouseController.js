import {GamePad} from "./gamePads/GamePad.js";
import {ErrorMouseControllerAlreadyExists} from '../error/CustomErrors.js';
import {EVENT_NAMES, KEY_CODES} from '../constants/constants.js';
import {ErrorInvalidEventType} from '../error/CustomErrors';

let controllerCreated = false;

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


    getIntersections(controller) {
        this.raycaster.setFromCamera(new THREE.Vector2(controller.axes[0], controller.axes[1]), this.camera);
        return this.raycaster.raycast();
    }

    gamepadHover(intersect) {
        //this.reycastingLine.geometry.vertices[1].z = -intersect.distance;
        //this.reycastingLine.geometry.verticesNeedUpdate = true;
    }

    gamepadHoverOut() {
        //this.reycastingLine.geometry.vertices[1].z = -50;
        //this.reycastingLine.geometry.verticesNeedUpdate = true;
    }

    static getGamepad() {
        return navigator.mouseGamePad;
    }

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

    startPropagation(eventName) {
        this.setPropagation(eventName, true);
    }

    stopPropagation(eventName) {
        this.setPropagation(eventName, false);
    }

    get axes() {
        return MouseController.getGamepad().axes;
    }


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

    onKeyUp(keyCode) {
        if (keyCode === KEY_CODES.KEY2) return;
        this.keyCode = null;
        this.engaged = false;
        this.startPropagation(EVENT_NAMES.MOUSE_DOWN);
        this.startPropagation(EVENT_NAMES.MOUSE_MOVE);
        this.pickedItems = [];
    }
}