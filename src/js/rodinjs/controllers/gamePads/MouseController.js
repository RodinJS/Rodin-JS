import {GamePad} from "./GamePad.js";

export class MouseController extends GamePad {
    constructor(scene = null, camera = null) {
        super("MouseEvent", null, scene, camera);
        //console.log(scene);
    }

    getIntersections() {
        this.tempMatrix.identity().extractRotation(this.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(this.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
        return this.raycaster.raycast();
    }
}