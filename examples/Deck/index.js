import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

import './objects/room_c.js';

let mouseController = new MouseController();
SceneManager.addController(mouseController);

const scene = SceneManager.get();
scene.add(new THREE.AmbientLight());
