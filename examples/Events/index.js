import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {EVENT_NAMES} from '../../_build/js/rodinjs/constants/constants.js';

let scene = SceneManager.get();
scene.add(new THREE.AmbientLight());
scene.setCameraProperty('far', 100);
let dl = new THREE.DirectionalLight();
dl.position.set(1, 1, 1);
scene.add(dl);

SceneManager.addController(new MouseController());

let cube = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshLambertMaterial({ color: 0x336699 })));

cube.on(EVENT_NAMES.READY, (evt) => {
    evt.target.object3D.position.y = scene.controls.userHeight;
    evt.target.object3D.position.z = -0.25;
    scene.add(evt.target.object3D);
    RODIN.Raycastables.push(evt.target.object3D);
});

cube.on(EVENT_NAMES.UPDATE, (evt) => {
    evt.target.object3D.rotation.y += RODIN.Time.deltaTime() / 1000;
    evt.target.object3D.rotation.x += RODIN.Time.deltaTime() / 2000;
});

cube.on([
    EVENT_NAMES.CONTROLLER_HOVER,
    EVENT_NAMES.CONTROLLER_HOVER_OUT
], handleEvent);

function handleEvent(evt) {
    console.log(evt);
}