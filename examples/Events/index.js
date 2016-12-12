import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

import {cube} from './objects/cube_c.js';
import {sphere} from './objects/sphere_c.js';
import {plane} from './objects/plane_c.js';

let scene = SceneManager.get();
scene.add(new THREE.AmbientLight());
scene.setCameraProperty('far', 100);
let dl = new THREE.DirectionalLight();
dl.position.set(1, 1, 1);
scene.add(dl);

const mouseController = new MouseController();
mouseController.raycastLayers = Infinity;
SceneManager.addController(mouseController);
