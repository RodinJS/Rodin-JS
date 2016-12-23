import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {ViveController} from '../../_build/js/rodinjs/controllers/ViveController.js';
import {OculusController} from '../../_build/js/rodinjs/controllers/OculusController.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

let scene = SceneManager.get();
let controls = scene.controls;

/**
 * Mouse Controller
 */
export const mouse = new MouseController();
SceneManager.addController(mouse);

/**
 * Oculus Controller
 */
export const oculus = new OculusController();
SceneManager.addController(oculus);


/**
 * Vive Controllers
 */
let controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, scene.camera, 1);
controllerL.standingMatrix = controls.getStandingMatrix();
SceneManager.addController(controllerL);
scene.add(controllerL);

let controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, scene.camera, 1);
controllerR.standingMatrix = controls.getStandingMatrix();
SceneManager.addController(controllerR);
scene.add(controllerR);

let loader = new THREE.OBJLoader();
loader.setPath('./models/');
loader.load('viveController/vr_controller_vive_1_5.obj', function (object) {

    let loader = new THREE.TextureLoader();
    loader.setPath('./models/');

    object.children[0].material.map = loader.load('./viveController/onepointfive_texture.png');
    object.children[0].material.specularMap = loader.load('./viveController/onepointfive_spec.png');

    controllerL.add(object.clone());
    controllerR.add(object.clone());
});

export const vive = {
    left: controllerL,
    right: controllerR
};
