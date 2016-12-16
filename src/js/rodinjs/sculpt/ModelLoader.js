import {ColladaModelObject} from './ColladaModelObject.js';
import {FBXModelObject} from './FBXModelObject.js';
import {OBJModelObject} from './OBJModelObject.js';
import {JSONModelObject} from './JSONModelObject.js';
import {JDModelObject} from './JDModelObject.js';
import {ErrorInstantiationFailed, ErrorUnsupportedModelType} from '../error/CustomErrors.js';

const supportedTypes = {
    'dae': ColladaModelObject,
    'fbx': FBXModelObject,
    'obj': OBJModelObject,
    'json': JSONModelObject,
    'js': JSONModelObject,
    'jd': JDModelObject
};

export class ModelLoader {
    constructor() {
        throw new ErrorInstantiationFailed('ModelLoader');
    }

    static load(url = '') {
        const urlSplitted = url.split('.');
        const type = urlSplitted[urlSplitted.length - 1].toLowerCase();

        if (Object.keys(supportedTypes).indexOf(type) !== -1) {
            return new supportedTypes[type](url);
        } else {
            throw new ErrorUnsupportedModelType(type);
        }
    }
}
