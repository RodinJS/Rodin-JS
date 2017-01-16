import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CardboardController} from '../../_build/js/rodinjs/controllers/CardboardController.js';
import {DragAndDrop} from './DragAndDrop_c.js';


let cardboardController = new CardboardController();

cardboardController.onKeyDown = function () {
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }
};

cardboardController.onKeyUp = function () {
    this.engaged = false;
    this.pickedItems = [];
};

cardboardController.onControllerUpdate = DragAndDrop.controllerUpdate;

SceneManager.addController(cardboardController);
export {cardboardController}
