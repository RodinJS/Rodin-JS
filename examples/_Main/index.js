import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

let scene = SceneManager.get();
let mouseController = new MouseController();
SceneManager.addController(mouseController);

let skybox = new CubeObject(15, 'img/boxW.jpg');
skybox.on(RODIN.CONSTANTS.EVENT_NAMES.READY, (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.y = scene.controls.userHeight;
});

let geometry = new THREE.BoxGeometry(0.015, 0.015, 0.015);
let material = new THREE.MeshNormalMaterial();

for (let i = 0; i < 1000; i++) {
    let cube = new RODIN.THREEObject(new THREE.Mesh(geometry, material));
    cube.on(RODIN.CONSTANTS.EVENT_NAMES.READY, (evt) => {
        evt.target.object3D.position.set(1.5 * (Math.random() - 0.5), scene.controls.userHeight - 3 * (Math.random() - 0.5), 1.5 * (Math.random() - 0.5));
        scene.add(evt.target.object3D);
    });

    cube.on(RODIN.CONSTANTS.EVENT_NAMES.UPDATE, (evt) => {
        evt.target.object3D.rotation.y += RODIN.Time.deltaTime() / 500;
    })
}
