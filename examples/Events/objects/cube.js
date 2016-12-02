import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';

let scene = SceneManager.get();
export const cube = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({ color: 0x336699 })));

cube.on(EVENT_NAMES.READY, (evt) => {
    evt.target.object3D.position.y = scene.controls.userHeight;
    evt.target.object3D.position.z = -1;
    evt.target.object3D.position.x = -0.5;
    scene.add(evt.target.object3D);
    RODIN.Raycastables.push(evt.target.object3D);
});

cube.on(EVENT_NAMES.UPDATE, (evt) => {
    evt.target.object3D.rotation.y += RODIN.Time.deltaTime() / 1000;
    evt.target.object3D.rotation.x += RODIN.Time.deltaTime() / 2000;
});

cube.on([
    EVENT_NAMES.CONTROLLER_HOVER,
    EVENT_NAMES.CONTROLLER_HOVER_OUT,
    EVENT_NAMES.CONTROLLER_KEY_DOWN,
    EVENT_NAMES.CONTROLLER_KEY_UP,
    EVENT_NAMES.CONTROLLER_KEY
], (evt) => {
    console.log(`Cube: ${evt.name}`);
});
