import {GamePad} from "./GamePad.js";
import {ErrorCardboardControllerAlreadyExists} from '../../error/CustomErrors.js';
import {EVENT_NAMES} from '../../constants/constants.js';
import {ErrorInvalidEventType} from '../../error/CustomErrors';

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
        return navigator.cardboardGamePad;
    }

    setPropagation(eventName, value) {
        let gamePad = CardboardController.getGamepad();
        value = !value;

        switch (eventName) {
            case EVENT_NAMES.MOUSE_DOWN:
                gamePad.stopPropagationOnCardboardDown = value;
                return;

            case EVENT_NAMES.MOUSE_UP:
                gamePad.stopPropagationOnCardboardUp = value;
                return;

            case EVENT_NAMES.MOUSE_MOVE:
                gamePad.stopPropagationOnCardboardMove = value;
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
        return CardboardController.getGamepad().axes;
    }
}