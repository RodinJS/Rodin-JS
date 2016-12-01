import {GamePad} from './gamePads/GamePad.js';
import {ErrorOculusControllerAlreadyExists} from '../error/CustomErrors.js';

let controllerCreated = false;

/**
 * Class OculusController
 */
export class OculusController extends GamePad {
    constructor(scene = null, camera = null) {
        if(controllerCreated) {
            throw new ErrorOculusControllerAlreadyExists();
        }

        controllerCreated = true;
        super('oculus', null, scene, camera);
    }

    /**
     * Get Intersections
     * Raycast from camera
     * @returns [Sculpt]
     */
    getIntersections() {
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }
}