import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CardboardController} from '../../_build/js/rodinjs/controllers/CardboardController.js';
import {DragAndDrop} from './DragAndDrop_c.js';


let cardboardController = new CardboardController();

cardboardController.onKeyDown = DragAndDrop.CardboardControllerKeyDown;
cardboardController.onKeyUp = DragAndDrop.CardboardControllerKeyUp;

cardboardController.onControllerUpdate = DragAndDrop.objectUpdate;

SceneManager.addController(cardboardController);
export {
    cardboardController
}
