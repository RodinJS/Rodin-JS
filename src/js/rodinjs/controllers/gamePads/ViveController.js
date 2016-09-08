import {GamePad} from "./GamePad.js";
import {ErrorNoValueProvided} from "../../error/CustomErrors.js";

export class ViveController extends GamePad {
    constructor(hand, scene = null, camera = null) {
        if (!hand) {
            throw new ErrorNoValueProvided('hand');
        }

        super('openvr', hand, scene, camera);
    }

    getIntersections() {
        this.tempMatrix.identity().extractRotation(this.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(this.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
        return this.raycaster.raycast();
    }
}
