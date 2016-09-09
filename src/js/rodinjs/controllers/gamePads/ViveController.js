import {GamePad} from "./GamePad.js";
import {ErrorNoValueProvided, ErrorViveControllerAlreadyExists} from "../../error/CustomErrors.js";
import {CONTROLLER_HANDS} from '../../constants/constants.js';

let leftHandControllerCreated = false;
let rightHandControllerCreated = false;

export class ViveController extends GamePad {
    constructor(hand, scene = null, camera = null) {
        if (!hand) {
            throw new ErrorNoValueProvided();
        }

        if (hand === CONTROLLER_HANDS.LEFT && leftHandControllerCreated || hand === CONTROLLER_HANDS.RIGHT && rightHandControllerCreated) {
            throw new ErrorViveControllerAlreadyExists(hand);
        }

        super('openvr', hand, scene, camera);

        hand === CONTROLLER_HANDS.LEFT ? leftHandControllerCreated = true : rightHandControllerCreated = true;
    }

    getIntersections() {
        this.tempMatrix.identity().extractRotation(this.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(this.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
        return this.raycaster.raycast();
    }
}
