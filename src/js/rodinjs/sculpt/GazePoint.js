import {THREEObject} from './THREEObject.js';
import {THREE} from '../../vendor/three/THREE.GLOBAL.js';

export class GazePoint {
    constructor (sculpt = null) {
        if (!sculpt) {
            const geometry = new THREE.RingGeometry(.001, .01, 32);
            const material = new THREE.MeshBasicMaterial({
                color: 0xc8d2dc,
                depthTest: false,
                transparent: true
            });

            sculpt = new THREEObject(new THREE.Mesh(geometry, material));
        }

        this.Sculpt = sculpt;

        this.Sculpt.on('update', (evt) => {
            if (!this.controller) return;

            if (this.controller.intersected.length === 0) {
                evt.target.object3D.position.z = -3;
            } else {
                evt.target.object3D.position.z = -this.controller.intersected[0].distance + .1;
            }
        })
    }
}