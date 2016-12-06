'use strict';

import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import {WTF} from '../logger/Logger.js';

import '../../vendor/three/examples/js/loaders/collada/AnimationHandler.js';
import '../../vendor/three/examples/js/loaders/collada/KeyFrameAnimation.js';
import '../../vendor/three/examples/js/loaders/collada/Animation.js';
import '../../vendor/three/examples/js/loaders/OBJLoader.js';
import '../../vendor/three/examples/js/loaders/DDSLoader.js';
import '../../vendor/three/examples/js/loaders/MTLLoader.js';

import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';

/**
 * If You want to use OBJ file, for avoid path problem
 * please export your file and material in the same folder.
 * And keep object and material name the same.
 * Obj format doesn't support animation.
 */

THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

export class OBJModelObject extends Sculpt {
    /**
     * OBJModelObject constructor.
     * @param {string} [URL = '']
     */
    constructor(URL = '') {

        super();

        let onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                WTF.is(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        let onError = function (xhr) {
            WTF.is('cannot load file');
        };

        let objLoader = new THREE.OBJLoader();
        let mtlLoader = new THREE.MTLLoader();

        objLoader.load(URL, mesh => {
            const mtlDir = URL.slice(0, URL.lastIndexOf("/") + 1);

            mtlLoader.setPath(mtlDir);
            mtlLoader.load(mesh.materialLibraries[0], (materials) => {
                materials.preload();

                objLoader.setMaterials(materials);
                objLoader.load(URL, mesh => {
                    this.init(mesh);
                    this.emit('ready', new Event(this));

                }, onProgress, onError);
            });

           WTF.is("OBJ file was loaded");
        }, onProgress, onError);
    }
}
