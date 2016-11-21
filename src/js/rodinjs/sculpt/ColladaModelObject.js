'use strict';
import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import '../../vendor/three/examples/js/loaders/collada/AnimationHandler.js';
import '../../vendor/three/examples/js/loaders/collada/KeyFrameAnimation.js';
import '../../vendor/three/examples/js/loaders/collada/Animation.js';
import '../../vendor/three/examples/js/loaders/ColladaLoader.js';
import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';
import * as RODIN from '../RODIN.js';

/**
 * For better experience you can export collada file from blender.
 * Select 'include Material Texture' option.
 */

export class ColladaModelObject extends Sculpt {
    /**
     * ColladaModelObject constructor.
     * @param {number} [id = 0]
     * @param {string} [URL = '']
     */
    constructor(id = 0,
                URL = '') {

        super(id);

        //let manager = new THREE.LoadingManager();
        //manager.onProgress = function (item, loaded, total) {
        //    console.log(item, loaded, total);
        //};

        let onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        let onError = function (xhr) {
        };

        new THREE.ColladaLoader().load(
            URL,
            (mesh) => {
                mesh.scene.traverse((child) => {
                    if (child instanceof THREE.SkinnedMesh) {
                        let animation = new THREE.Animation(child, child.geometry.animation);
                        animation.play();
                    }
                });

                this.init(mesh.scene);

                /// TODO: log messages with our custome loger
                console.log("COLLADA file was loaded");

                this.emit('ready', new Event(this));
            }, onProgress, onError);

        this.on("update", (evt) => {
            THREE.AnimationHandler.update(RODIN.Time.deltaTime()/1000);
        });

        // todo create resetAxis function
        this.resetAxis = () => {

        };

    }
}