import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {THREEObject} from '../../_build/js/rodinjs/sculpt/THREEObject.js';

import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {DragAndDrop} from './DragAndDrop_c.js';

import {RigidBody} from '../../_build/js/rodinjs/physics/RigidBody.js';
import {RodinPhysics} from '../../_build/js/rodinjs/physics/RodinPhysics.js';

import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {EVENT_NAMES, CONTROLLER_HANDS} from '../../_build/js/rodinjs/constants/constants.js';

///// loading lights /////
import {Lights} from './Lights_c.js';

///// loading 3D models /////
import {Import3DModels} from './Import3DModels_c.js';

import {controllerL, controllerR} from './ViveControllers_c.js';
import {oculusController} from './OculusController_c.js';

let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;

renderer.setPixelRatio(window.devicePixelRatio);
scene.setCameraProperty('far', 100);

/// mouse controller
let mouseController = new MouseController();
SceneManager.addController(mouseController);
mouseController.onControllerUpdate = DragAndDrop.controllerUpdate;

// add skybox
let skybox = new CubeObject(50, 'models/textures/skybox.jpg');
skybox.on('ready', () => {
    skybox.object3D.position.y = controls.userHeight;
    skybox.object3D.rotation.y = Math.PI;
    scene.add(skybox.object3D);
});

///// physics /////
scene.physics = RodinPhysics.getInstance('oimo');

//Setting up world
scene.physics.setupWorldGeneralParameters(0, -9.8, 0, 8, true, 32);

scene.preRender(() => {
    // Update scene's objects physics.
    scene.physics.updateWorldPhysics(RODIN.Time.deltaTime());
});


