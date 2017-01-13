import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {OculusController} from '../../_build/js/rodinjs/controllers/OculusController.js';
import {DragAndDrop} from './DragAndDrop_c.js';


let oculusController = new OculusController();

oculusController.onKeyDown = function () {
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }
};

oculusController.onKeyUp = function () {
    this.engaged = false;
    this.pickedItems = [];
};

oculusController.onControllerUpdate = DragAndDrop.controllerUpdate;

SceneManager.addController(oculusController);
export {oculusController}
