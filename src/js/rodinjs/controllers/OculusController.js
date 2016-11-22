import {GamePad} from './gamePads/GamePad.js';
import {ErrorOculusControllerAlreadyExists} from '../error/CustomErrors.js';

let controllerCreated = false;

export class OculusController extends GamePad {
    constructor(scene = null, camera = null) {
        if(controllerCreated) {
            throw new ErrorOculusControllerAlreadyExists();
        }
        super('oculus', null, scene, camera);
    }

    getIntersections() {
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }
}