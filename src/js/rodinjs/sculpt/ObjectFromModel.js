import {Sculpt} from './Sculpt.js';
import { THREE } from '../../three/THREE.GLOBAL.js';
import * as CustomErrors from '../error/CustomErrors';
import { timeout } from '../utils/timeout.js';
import { Event } from '../Event.js';

/**
 * Abstract class ObjectFromModel
 * @todo: new.target safari problem
 */
export class ObjectFromModel extends Sculpt {
    constructor(SubClass, _geometry, _materials) {
/*        if (new.target === ObjectFromModel) {
            throw new CustomErrors.ErrorAbstractClassInstance();
        }*/

        if (!_geometry.url) {
            throw new CustomErrors.ErrorInvalidUrl('geometry');
        }

        super();

        SubClass.objectLoaded = SubClass.objectLoaded || false;
        SubClass.geometry = SubClass.geometry || {};
        SubClass.materials = SubClass.materials || [];

        if(!SubClass.objectLoaded) {
            new THREE.JSONLoader().load(
                _geometry.url,
                (geometry, materials) => {
                    SubClass.geometry = geometry;
                    SubClass.materials = new THREE.MultiMaterial(materials);
                    SubClass.objectLoaded = true;

                    for (let i = 0; i < _materials.length; i++) {
                        materials[i] = new THREE.MeshLambertMaterial(_materials[i]);
                        if(_materials[i].url) {
                            materials[i].map = new THREE.TextureLoader().load(_materials[i].url);
                        }
                    }

                    this.init(new THREE.Mesh(SubClass.geometry, SubClass.materials));
                    this.emit('ready', new Event(this));
                }
            )
        } else {
            timeout(() => {
                this.init(new THREE.Mesh(SubClass.geometry, SubClass.materials));
                this.emit('ready', new Event(this));
            });
        }
    }
}
