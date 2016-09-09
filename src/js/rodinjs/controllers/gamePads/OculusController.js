import {GamePad} from './GamePad.js';
import {ErrorOculusControllerAlreadyExists} from '../../error/CustomErrors.js';

let controllerCreated = false;

export class OculusController extends GamePad {
    constructor(scene = null, cameara = null) {
        if(controllerCreated) {
            throw new ErrorOculusControllerAlreadyExists();
        }
        super('oculus', null, scene, cameara);
    }

    getIntersections() {
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }
}