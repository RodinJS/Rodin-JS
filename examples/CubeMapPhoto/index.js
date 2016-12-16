import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeMapFromModel} from '../../_build/js/rodinjs/sculpt/CubeMapFromModel.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

let scene = SceneManager.get();

let mouseController = new MouseController();
SceneManager.addController(mouseController);

let boxSize = 15;
let skybox = new CubeMapFromModel(boxSize, 'img/map2.png');
skybox.on(RODIN.CONSTANTS.EVENT_NAMES.READY, (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.y = scene.controls.userHeight;
});