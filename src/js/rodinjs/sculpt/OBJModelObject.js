'use strict';

import {THREE} from '../../vendor/three/THREE.GLOBAL.js';

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

export class OBJModelObject extends Sculpt {
    /**
     * OBJModelObject constructor.
     * @param {number} [id = 0]
     * @param {string} [URL = '']
     * @param {array} [TextureURL = []]
     */
    constructor(id = 0,
                URL = '',
                TextureURL = []) {

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

        if (!(TextureURL instanceof Array)) {
            TextureURL = [TextureURL];
        }

        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

        let mtlLoader = new THREE.MTLLoader();

        // get mtl file path and name
        let getMtlLoaderPath = URL.slice(0, URL.lastIndexOf("/") + 1);
        mtlLoader.setPath(getMtlLoaderPath);
        let mtlLoaderName = URL.slice(getMtlLoaderPath.length, URL.lastIndexOf("."));

        // load mlt file
        mtlLoader.load(mtlLoaderName + '.mtl', (materials) => {
            materials.preload();
            let i = 0;
            // load textures if their paths are absolute
            for (let materialName in materials.materialsInfo) {
                if (materials.materialsInfo.hasOwnProperty(materialName)) {
                    if (!TextureURL.length) {
                        // get texture path from mtl file
                        let mapKa = materials.materialsInfo[materialName].map_ka;
                        if (mapKa) {
                            let texturePath = getMtlLoaderPath + mapKa.slice(mapKa.lastIndexOf("\\") + 1);
                            materials.materials[materialName].map = new THREE.TextureLoader().load(texturePath);
                        }
                    } else {
                        // get texture path from TextureURL array
                        if (materials.materials[materialName].map) {
                            materials.materials[materialName].map = new THREE.TextureLoader().load(TextureURL[i]);
                            i++;
                        }
                    }
                }
            }

            let objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(
                URL,
                (mesh) => {
                    this.init(mesh);
                    this.emit('ready', new Event(this));

                    console.log("OBJ file was loaded");
                }, onProgress, onError);
        }, function () {
        }, () => {
            let objLoader = new THREE.OBJLoader();
            objLoader.load(
                URL,
                (mesh) => {
                    this.init(mesh);
                    this.emit('ready', new Event(this));

                    console.log("OBJ file was loaded");
                }, onProgress, onError);
        });


        this.on("update", (evt, delta) => {
            THREE.AnimationHandler.update(delta);
        });
    }
}