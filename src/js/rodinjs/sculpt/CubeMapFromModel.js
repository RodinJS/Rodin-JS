import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';
import {JSONModelObject} from './JSONModelObject.js';

export class CubeMapFromModel extends Sculpt {
    constructor (id, size, textureURL, material) {
        super(id);
        // todo ASAP: find normal method
        let cube = new JSONModelObject(id, '/_build/js/rodinjs/resources/models/cubemap.js');
        cube.on('ready', () => {
            if (textureURL) {
                new THREE.TextureLoader().load(textureURL, (texture) => {
                    let material = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        map: texture
                    });
                    cube.object3D.scale.set(size, size, size);
                    cube.object3D.material = material;
                    super.init(cube.object3D);
                    return this.emit("ready", new Event(this));
                });
            } else if (material) {
                cube.object3D.material = material;
                cube.object3D.scale.set(size, size, size);
                super.init(cube.object3D);
                return this.emit("ready", new Event(this));
            }
        });
    }
}
