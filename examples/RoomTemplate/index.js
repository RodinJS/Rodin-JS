import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {RodinPhysics} from '../../_build/js/rodinjs/physics/RodinPhysics.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';

import {Lights} from './Lights_c.js';
import {Import3DModels} from './Import3DModels_c.js';
import {DragAndDrop} from './DragAndDrop_c.js';

let scene = SceneManager.get();
let controls = scene.controls;
let renderer = scene.renderer;

renderer.setPixelRatio(window.devicePixelRatio);
scene.setCameraProperty('far', 100);

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


