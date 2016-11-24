'use strict';

import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import '../vendor/JDLoader.min.js';
import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';
import {Time} from './../time/Time.js';

/**
 * You can export JD file from 3ds max
 * For export use Json 3D Exporter for 3ds Max 2016 - http://www.cgdev.net/json/download.php
 */
const time = Time.getInstance();
export class JDModelObject extends Sculpt {
    /**
     * JDModelObject constructor.
     * @param {number} [id = 0]
     * @param {string} [URL = '']
     */
    constructor(id = 0, URL = '') {

        super(id);

        // let manager = new THREE.LoadingManager();
        // manager.onProgress = function (item, loaded, total) {
        //     console.log(item, loaded, total);
        // };

        let onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        let onError = function (xhr) {
        };

        let mixers = [];

        new THREE.JDLoader().load(
            URL,
            (data) => { // data: { materials, geometries, boundingSphere }
                let multiMaterial = new THREE.MultiMaterial(data.materials);
                let meshes = new THREE.Object3D;

                for (let i = 0; i < data.geometries.length; ++i) {
                    let mesh = new THREE.SkinnedMesh(data.geometries[i], multiMaterial);
                    mesh.matrixAutoUpdate = false;
                    mesh.updateMatrix();

                    meshes.add(mesh);

                    if (mesh.geometry.animations) {
                        let mixer = new THREE.AnimationMixer();
                        mixers.push(mixer);
                        mixer.clipAction(mesh.geometry.animations[0], mesh)
                            .setDuration(1)
                            .play();
                    }
                }

                this.init(meshes);
                this.emit('ready', new Event(this));

                console.log("JD file was loaded");
            }, onProgress, onError);

        this.on("update", (evt) => {
            if (mixers) {
                if (mixers.length > 0) {
                    for (let i = 0; i < mixers.length; i++) {
                        mixers[i].update(time.deltaTime()/1000);
                    }
                }
            }
        });
    }
}

