'use strict';

import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';
import {Time} from '../time/Time.js';
import {WTF} from '../logger/Logger.js';

import '../../vendor/three/examples/js/loaders/FBXLoader.js';

/**
 * You can export FBX file from 3ds max
 * For export use ASCII format
 */
/**
 * in oder to maintain correct positions to each other, all exported objects must have their pivots shifted to {0, 0, 0} position of the scene.
 * This is due to FBX format positioning all objects in {0,0,0} position.
 */

const time = Time.getInstance();
export class FBXModelObject extends Sculpt {
    /**
     * FBXModelObject constructor.
     * @param {string} [URL = '']
     * @param {array} [TextureURL = []]
     */
    constructor (URL = '', TextureURL = []) {
        super();

        if (!(TextureURL instanceof Array)) {
            TextureURL = [TextureURL];
        }

        let onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                WTF.is(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        let onError = function (xhr) {
        };

        let mixers = [];
        let fbxLoader = new THREE.FBXLoader();
        fbxLoader.load(URL, mesh => {
            mesh.traverse(function (child) {
                if (child instanceof THREE.SkinnedMesh) {
                     if (child.geometry.animations !== undefined || child.geometry.morphAnimations !== undefined) {
                        child.mixer = new THREE.AnimationMixer();
                        child.mixer.clipAction(child.geometry.animations[0], child).setDuration(1).play();

                         for (let i = 0; i < TextureURL.length; i++) {
                             child.material.color = [1, 1, 1];
                         }
                        mixers.push(child.mixer);
                     }
                }
            });

            this.init(mesh);
            this.emit('ready', new Event(this));

            WTF.is("FBX file was loaded");
        }, onProgress, onError);

        this.on("update", () => {
            if (mixers) {
                if (mixers.length > 0) {
                    for (let i = 0; i < mixers.length; i++) {
                        mixers[i].update(time.deltaTime() / 1000);
                    }
                }
            }
        });
    }
}



