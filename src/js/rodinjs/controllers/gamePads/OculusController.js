import {GamePad} from './GamePad.js';

export class OculusController extends GamePad {
    constructor(scene = null, cameara = null) {
        super('oculus', null, scene, cameara);
    }

    getIntersections() {
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }
}