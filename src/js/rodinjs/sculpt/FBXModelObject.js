import {THREE} from '../../vendor/three/THREE.GLOBAL.js';

import '../../vendor/three/examples/js/loaders/FBXLoader.js';

import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';
import {Time} from '../time/Time.js';

const time = Time.getInstance();

/**
 * You can export FBX file from 3ds max
 * For export use ASCII format
 */

export class FBXModelObject extends Sculpt {
    /**
     * FBXModelObject constructor.
     * @param {number} [id = 0]
     * @param {string} [URL = '']
     * @param {array} [TextureURL = []]
     */
    constructor(id = 0,
                URL = '',
                TextureURL = []) {

        super(id);

        if (!(TextureURL instanceof Array)) {
            TextureURL = [TextureURL];
        }

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

        let loader = new THREE.FBXLoader(/*manager*/);
        loader.load(
            URL,
            mesh => {
                mesh.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        // pass
                    }

                    if (child instanceof THREE.SkinnedMesh) {
                        if (TextureURL) {
                            for (let i = 0; i < TextureURL.length; i++) {
                                child.material.color = [1, 1, 1];
                                child.material.map = new THREE.TextureLoader().load(TextureURL[i]);
                            }
                        }

                        if (child.geometry.animations !== undefined || child.geometry.morphAnimations !== undefined) {
                            child.mixer = new THREE.AnimationMixer();
                            child.mixer.clipAction(child.geometry.animations[0], child)
                                .setDuration(1)
                                .play();

                            mixers.push(child.mixer);
                        }
                    }
                });

                this.init(mesh);
                this.emit('ready', new Event(this));

                console.log("FBX file was loaded");

            }, onProgress, onError);

        this.on("update", (evt) => {
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



