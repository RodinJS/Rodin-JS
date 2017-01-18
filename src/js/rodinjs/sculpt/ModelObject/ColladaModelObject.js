'use strict';
import {THREE} from '../../../vendor/three/THREE.GLOBAL.js';
import {Event} from '../../Event.js';
import {WTF} from '../../logger/Logger.js';
import {Time} from '../../time/Time.js';
import {ModelObject} from './ModelObject.js';

import '../../../vendor/three/examples/js/loaders/collada/AnimationHandler.js';
import '../../../vendor/three/examples/js/loaders/collada/KeyFrameAnimation.js';
import '../../../vendor/three/examples/js/loaders/collada/Animation.js';
import '../../../vendor/three/examples/js/loaders/ColladaLoader.js';

/**
 *  This class allows you to load JD exported files to the scene.
 * <p>For better experience you can export collada file from blender.</p>
 * Select 'include Material Texture' option.
 */
const time = Time.getInstance();
export class ColladaModelObject extends ModelObject {

    /**
     * ColladaModelObject constructor.
     * @param {string} [URL = '']
     */
    constructor (URL = '') {
        super();

        let onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                WTF.is(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        let onError = function () {
            WTF.is(`cannot download file`);
        };

        new THREE.ColladaLoader().load(URL, mesh => {
            mesh.scene.traverse((child) => {
                if (child instanceof THREE.SkinnedMesh) {
                    let animation = new THREE.Animation(child, child.geometry.animation);
                    animation.isPlaying = animation.isRunning;
                    animation.name = animation.name || 'unnamed';
                    console.log(animation);
                    this.animator.add(animation);
                }
            });

            this.init(mesh.scene);

            WTF.is("COLLADA file was loaded");
            this.emit('ready', new Event(this));
        }, onProgress, onError);

        this.on("update", (evt) => {
           THREE.AnimationHandler.update(time.deltaTime() / 1000);
        });
    }
}
