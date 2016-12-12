import {GamePad} from './gamePads/GamePad.js';
import {ErrorOculusControllerAlreadyExists} from '../error/CustomErrors.js';

let controllerCreated = false;

/**
 * A controller class for describing Oculus Rift controller event handlers .
 */
export class OculusController extends GamePad {
    /**
     * Constructor
     * @param {THREE.Scene} scene Required - the scene where the controller will be used.
     * @param {THREE.PerspectiveCamera, THREE.OrthographicCamera} camera Required - the camera where the controller will be used.
     */
    constructor(scene = null, camera = null) {
        if(controllerCreated) {
            throw new ErrorOculusControllerAlreadyExists();
        }

        controllerCreated = true;
        super('oculus', null, scene, camera);
    }

    /**
     * Get raycasted objects ({distance, point, face, faceIndex, indices, object}) that are in camera's center.
     * @returns [Object]
     */
    getIntersections() {
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }
}