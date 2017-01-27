import {ErrorProtectedFieldChange} from '../error/CustomErrors.js';
import {Manager} from '../manager/Manager.js';
import {GamePad} from './gamePads/GamePad.js';
import {MouseController} from './MouseController.js';
import {CardboardController} from './CardboardController.js';
import {ViveController} from './ViveController.js';
import {Set} from '../utils/Set.js';
import * as RODIN from '../RODIN.js';
/**
 * <p>A manager for Controllers, allows users to switch between controller la la la</p>
 */
class ControllerManager extends Manager {
    constructor() {
        super(GamePad);
        this.controllers = {};
        this.controllerTypes = {
            "mouse" : MouseController,
            "cardboard" : CardboardController,
            "vive" : ViveController
        };
    }

    create() {
        let type = arguments[0];
        Array.prototype.shift.apply(arguments);
        const item = new this.controllerTypes[type](...arguments);
        let keys = Object.keys(this._items);
        const index = (parseInt(keys[keys.length - 1]) || 0) + 1;
        this._items[index] = item;
        item._MANAGER_INDEX = index;

        return item;
    }

    /**
     * Activate and get a controller.
     * @param {*} index
     */
    getController(index) {
        let controller = this.get(index);
        controller.enable();
        //this._active = controller._MANAGER_INDEX;
        return controller;
    }

}

const instance = new ControllerManager();

RODIN.ControllerManager = instance;
export {instance as ControllerManager};
