'use strict';

import {THREE} from '../../three/THREE.GLOBAL.js';
import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';
import {OBJModelObject} from './OBJModelObject.js';
import {JSONModelObject} from './JSONModelObject.js';

export class CubeMapFromModel extends Sculpt {
    constructor(id, size, textureURL, material) {
        super(id);
        let cube = new JSONModelObject(id, './model/object.js');
        cube.on('ready', () => {
            if(textureURL){
                let texture = new THREE.TextureLoader().load(textureURL, (texture) => {
                    let cubeMat = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        map: texture
                    });
                    cube.object3D.scale.set(size, size, size);
                    cube.object3D.material = cubeMat;
                    super.init(cube.object3D);
                    return this.emit("ready", new Event(this));
                });
            }else if (material){
                cube.object3D.material = material;
                cube.object3D.scale.set(size, size, size);
                super.init(cube.object3D);
                return this.emit("ready", new Event(this));
            }

        });

    }

}