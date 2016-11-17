'use strict';

import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';

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
                this.emit('ready', new Event(this));

                console.log("COLLADA file was loaded");
            }, onProgress, onError);

        this.on("update", (evt, delta) => {
            THREE.AnimationHandler.update(delta);
        });

        // todo create resetAxis function
        this.resetAxis = () => {

        };

    }
}