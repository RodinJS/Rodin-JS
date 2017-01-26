import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {OculusController} from '../../_build/js/rodinjs/controllers/OculusController.js';
import {ViveController} from '../../_build/js/rodinjs/controllers/ViveController.js';
import {THREEObject} from '../../_build/js/rodinjs/sculpt/THREEObject.js';
import {Time} from '../../_build/js/rodinjs/time/Time.js';
import {EVENT_NAMES, KEY_CODES, CONTROLLER_HANDS} from '../../_build/js/rodinjs/constants/constants.js';

let scene = SceneManager.get();
SceneManager.addController(new MouseController());
SceneManager.addController(new OculusController());

let controllerL = new ViveController(CONTROLLER_HANDS.LEFT, scene, scene.camera, 2);
let controllerR = new ViveController(CONTROLLER_HANDS.RIGHT, scene, scene.camera, 2);
controllerL.standingMatrix = scene.controls.getStandingMatrix();
controllerL.initControllerModel();
controllerL.initRaycastingLine();
SceneManager.addController(controllerL);
scene.add(controllerL);

controllerR.standingMatrix = scene.controls.getStandingMatrix();
controllerR.initControllerModel();
controllerR.initRaycastingLine();
SceneManager.addController(controllerR);
scene.add(controllerR);

const time = Time.getInstance();

let dl = new THREE.DirectionalLight();
dl.position.set(5, 5, 5);
scene.add(dl);
let al = new THREE.AmbientLight();
al.intensity = .3;
scene.add(al);

const cube = new THREEObject(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial()));

cube.on('ready', (evt) => {
    evt.target.raycastable = true;
    evt.target.object3D.position.z = -3;
    evt.target.object3D.position.y = scene.controls.userHeight;
    scene.add(evt.target.object3D);
});

cube.on('update', (evt) => {
    evt.target.object3D.rotation.y += .0005 * time.deltaTime();
    evt.target.object3D.rotation.z += .001 * time.deltaTime();
});

cube.on([EVENT_NAMES.CONTROLLER_KEY_DOWN, EVENT_NAMES.CONTROLLER_KEY_UP], (evt) => {
    console.log(evt);
});
