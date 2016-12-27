import {ErrorProtectedFieldChange} from '../error/CustomErrors.js';
import {Manager} from '../manager/Manager.js';
import {Scene} from './Scene.js';
import {Set} from '../utils/Set.js';
import * as RODIN from '../RODIN.js';
/**
 * <p>A manager for Scenes, allows users to switch between active scenes, add controllers and handle Time instance</p>
 */
class SceneManager extends Manager {
    constructor () {
        super(Scene);

        /**
         * The set of controllers.
         * @type {Set<Gamepad>}
         */
        this.controllers = new Set();

        let scene = this.create();
        this.go(scene);
    }

    /**
     * Switch active scene.
     * @param {*} index
     */
    go (index) {
        let scene = this.get(index);
        scene.enable();
        this._active = scene._MANAGER_INDEX;

        for (let i = 0; i < this.controllers.length; i++) {
            scene.addController(this.controllers[i]);
        }

        scene.controllers = this.controllers;
    }

    /**
     * Add controller to SceneManager
     * @param {GamePad} controller
     */
    addController (controller) {
        this.controllers.push(controller);
        this.get().addController(controller);
    }

    changeContainerDomElement(element){
        for(let i = 0; i < this._items.length; i++){
            let scene = this._items[i];
            scene.renderer.domElement.parentNode.removeChild(scene.renderer.domElement);
            element.appendChild(scene.renderer.domElement);
        }
    }
}

const instance = new SceneManager();

RODIN.SceneManager = instance;
Object.defineProperty(RODIN, 'Time', {
    get: ()=> {
        return instance.get().time;
    },
    set: ()=> {
        throw new ErrorProtectedFieldChange("Time");
    }
});

export {instance as SceneManager};
