import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {OculusController} from '../../_build/js/rodinjs/controllers/OculusController.js';
import {DragAndDrop} from './DragAndDrop_c.js';

let oculusController = new OculusController();

oculusController.onKeyDown = DragAndDrop.OculusControllerKeyDown;
oculusController.onKeyUp = DragAndDrop.OculusControllerKeyUp;

oculusController.onControllerUpdate = DragAndDrop.objectUpdate;

SceneManager.addController(oculusController);
export {
    oculusController
}
