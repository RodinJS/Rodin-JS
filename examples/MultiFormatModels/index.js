import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

import {colladaGroup} from './objects/collada_c.js';
import {fbxGroup} from './objects/fbx_c.js';
import {objGroup} from './objects/obj_c.js';

let scene = SceneManager.get();
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

scene.scene.background = new THREE.Color(0x808080);