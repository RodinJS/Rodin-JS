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

    getIntersections() {
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }

    static getGamepad() {
        return navigator.cardboardGamePad;
    }
}