import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeMapFromModel} from '../../_build/js/rodinjs/sculpt/CubeMapFromModel.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

let scene = SceneManager.get();
let mouseController = new MouseController();
SceneManager.addController(mouseController);

let boxSize = 15;
let skybox = new CubeMapFromModel(0, boxSize, 'img/map2.png');
skybox.on(RODIN.CONSTANTS.EVENT_NAMES.READY, (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.y = scene.controls.userHeight;
});


// Create 3D objects.
let boxCount = 100;
let particleBoxSize = 0.015;
let geometry = new THREE.BoxGeometry(particleBoxSize, particleBoxSize, particleBoxSize);
let material = new THREE.MeshNormalMaterial();
//let cube = new THREE.Mesh(geometry, material);
let cubes = [];
for (let i = 0; i < boxCount; i++) {
    cubes.push(new THREE.Mesh(geometry, material));
    cubes[i].position.set(Math.randomFloatIn(-0.75,0.75),
        scene.controls.userHeight - Math.randomFloatIn(-1.5,1.5),
        Math.randomFloatIn(-0.75,0.75));
    scene.add(cubes[i]);
}
