import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController';
import {DragAndDrop} from './DragAndDrop_c.js';

let mouseController = new MouseController();

mouseController.onControllerUpdate = DragAndDrop.objectUpdate;

SceneManager.addController(mouseController);
export {
    mouseController
}