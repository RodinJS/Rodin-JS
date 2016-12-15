import {ColladaModelObject} from './ModelObject/ColladaModelObject.js';
import {FBXModelObject} from './FBXModelObject.js';
import {OBJModelObject} from './OBJModelObject.js';
import {JSONModelObject} from './JSONModelObject.js';
import {JDModelObject} from './ModelObject/JDModelObject.js';
import {ErrorInstantiationFailed, ErrorUnsupportedModelType} from '../error/CustomErrors.js';

const supportedTypes = {
    'dae': ColladaModelObject,
    'fbx': FBXModelObject,
    'obj': OBJModelObject,
    'json': JSONModelObject,
    'js': JSONModelObject,
    'jd': JDModelObject
};

/**
 * Class ModelLoader
 * Loads 3D models .DAE .FBX .OBJ .JSON .JS .JD formats
 */
export class ModelLoader {
    /**
     * throws error.
     * use static method load
     */
    constructor() {
        throw new ErrorInstantiationFailed('ModelLoader');
    }

    /**
     * load model form url, create Sculpt object
     * @param {string} url - url for model
     * @returns {Sculpt} - created sculpt object from model
     */
    static load(url = '') {
        const urlSplitted = url.split('.');
        const type = urlSplitted[urlSplitted.length - 1].toLowerCase();

        if(Object.keys(supportedTypes).indexOf(type) !== -1) {
            return new supportedTypes[type](url);
        } else {
            throw new ErrorUnsupportedModelType(type);
        }
    }
}
