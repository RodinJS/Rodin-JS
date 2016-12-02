import {Set} from './utils/Set';

/**
 * All active objects
 * @type {Set}
 */
export const Objects = new Set();

/**
 * All raycastable objects
 * @type {Set}
 */
export const Raycastables = new Set();

Raycastables.validate = (item) => {
    if(item.isSculpt) {
        return item.object3D;
    }

    if(item.Sculpt) {
        return item;
    }

    throw new Error(`Raycastables can contain only Sculpt or Object3D`);
};