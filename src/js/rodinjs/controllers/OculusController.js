import {GamePad} from './gamePads/GamePad.js';
import {GazePoint} from '../sculpt/GazePoint.js';
import {ErrorOculusControllerAlreadyExists} from '../error/CustomErrors.js';

let controllerCreated = false;

/**
 * A controller class for describing Oculus Rift controller event handlers .
 */
export class OculusController extends GamePad {
    /**
     * Constructor
     * @param {THREE.Scene} scene Required - the scene where the controller will be used.
     * @param {THREE.PerspectiveCamera} camera - the camera where the controller will be used.
     */
    constructor(scene = null, camera = null) {
        if(controllerCreated) {
            throw new ErrorOculusControllerAlreadyExists();
        }

        controllerCreated = true;
        super('oculus', null, scene, camera);
		this.setGazePoint(new GazePoint());
		this.disable();
    }

    /**
     * Get raycasted objects ({distance, point, face, faceIndex, indices, object}) that are in camera's center.
     * @returns [Object]
     */
    getIntersections() {
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }

	/**
	 * Set GazePoint
	 * @param {GazePoint} gazePoint object to add
	 */
	setGazePoint(gazePoint) {
		gazePoint.controller = this;
		this.gazePoint = gazePoint;
		if(this.camera) {
			this.camera.add(this.gazePoint.Sculpt.object3D);
		}
	}
}