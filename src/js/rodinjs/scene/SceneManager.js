import {ErrorProtectedFieldChange} from '../error/CustomErrors.js';
import {Manager} from '../manager/Manager.js';
import {Scene} from './Scene.js';
import {Set} from '../utils/Set.js';
import * as RODIN from '../RODIN.js';

class SceneManager extends Manager {
    constructor () {
        super(Scene);

        this.controllers = new Set();

        let scene = this.create();
        this.go(scene);
    }

    go (index) {
        let scene = this.get(index);
        scene.enable();
        this._active = scene._MANAGER_INDEX;

        for (let i = 0; i < this.controllers.length; i++) {
            scene.addController(this.controllers[i]);
        }

        scene.controller = this.controllers;
    }

    addController (controller) {
        this.controllers.push(controller);
        this.get().addController(controller);
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
