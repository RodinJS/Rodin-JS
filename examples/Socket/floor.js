import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

export default function (scene) {
    let cube = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()))
}