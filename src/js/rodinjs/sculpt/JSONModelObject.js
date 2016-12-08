'use strict';

import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';
import {Time} from './../time/Time.js';

/**
 * If your model consists of several geometries
 * and the material ids do not map in correct order,
 * You can open the model in a 3d editing software,
 * attach all geometries to a single object and export again.
 */

const time = Time.getInstance();
export class JSONModelObject extends Sculpt {
    /**
     * JSONModelObject constructor.
     * @param {string} [URL = '']
     */
    constructor(URL = '') {
        super();

        let onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        let onError = function (xhr) {
        };

        let mixers = [];

        new THREE.JSONLoader().load(URL, (geometry, materials) => {
            let material = materials[0];
            material.morphTargets = true;
            let faceMaterial = new THREE.MultiMaterial(materials);
            let mesh = new THREE.SkinnedMesh(geometry, faceMaterial);

            if (mesh.geometry.animations) {
                let mixer = new THREE.AnimationMixer();
                mixers.push(mixer);
                mixer.clipAction(mesh.geometry.animations[0], mesh)
                    .setDuration(1)
                    .play();
            }

            this.init(mesh);
            this.emit('ready', new Event(this));

            console.log("JSON file was loaded");
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

