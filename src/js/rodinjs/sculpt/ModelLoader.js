import {ColladaModelObject} from './ColladaModelObject.js';
import {FBXModelObject} from './FBXModelObject.js';
import {OBJModelObject} from './OBJModelObject.js';
import {ErrorInstantiationFailed, ErrorUnsupportedModelType} from '../error/CustomErrors.js';

const types = {
    'dae': ColladaModelObject,
    'fbx': FBXModelObject,
    'obj': OBJModelObject,
};

export class ModelLoader {
    constructor() {
        throw new ErrorInstantiationFailed('ModelLoader');
    }

    static load(url = '') {
        const urlSplitted = url.split('.');
        const type = urlSplitted[urlSplitted.length - 1].toLowerCase();

        if(Object.keys(type).indexOf(type) !== -1) {
            return new types[type](url);
        } else {
            throw new ErrorUnsupportedModelType(type);
        }
    }
}
