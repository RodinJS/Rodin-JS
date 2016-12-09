import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';

let scene = SceneManager.get();
let controls = scene.controls;
let mouseController = new MouseController();
SceneManager.addController(mouseController);

let light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(1, 1, 1);
scene.add(light1);

let light2 = new THREE.DirectionalLight(0xcccccc);
light2.position.set(-1, -1, -1);
scene.add(light2);

let amlight = new THREE.AmbientLight(0x3e3e3e);
scene.add(amlight);

let skybox = new CubeObject(15, 'img/boxW.jpg');
skybox.on(RODIN.CONSTANTS.EVENT_NAMES.READY, (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.y = scene.controls.userHeight;
});

let obj = ModelLoader.load('./model/cardboard.obj');
obj.on('ready', () => {
    obj.object3D.position.y = controls.userHeight;
    obj.object3D.position.z = -0.5;
    scene.add(obj.object3D);
});

obj.on('update', () => {
    obj.object3D && (obj.object3D.rotation.y += RODIN.Time.deltaTime()/2000);
});