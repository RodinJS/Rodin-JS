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
    // RODIN.CONSTANTS.EVENT_NAMES.READY
    cube.on('ready', (evt) => {
        evt.target.object3D.position.set(Math.randomFloatIn(-0.75,0.75),
                                        scene.controls.userHeight - Math.randomFloatIn(-1.5,1.5),
                                        Math.randomFloatIn(-0.75,0.75));
        scene.add(evt.target.object3D);
        RODIN.Raycastables.push(evt.target.object3D);
    });
    // RODIN.CONSTANTS.EVENT_NAMES.UPDATE
    cube.on('update', (evt) => {
        evt.target.object3D.rotation.y += RODIN.Time.deltaTime() / 500;
    });
    // RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT
    cube.on('controllerhoverout', (evt) => {
        evt.target.object3D.scale.set(2, 2, 2);
    });
}
