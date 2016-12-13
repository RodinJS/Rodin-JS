import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import '../../vendor/oimo/oimo.js';
import '../../vendor/cannon/cannon.js';

/**
 * Converts oimo datatypes to three datatypes
 * @param { OIMO.Vec3, OIMO.Quaternion } a
 * @return { THREE.Vector3, THREE.Quaternion }
 **/
export function oimoToThree(a) {
    switch (a.constructor) {
        case (new OIMO.Vec3()).constructor:
            return new THREE.Vector3(a.x, a.y, a.z);
        case (new OIMO.Quaternion()).constructor:
            return new THREE.Quaternion(a.x, a.y, a.z, a.w);
    }
}

/**
 * Converts three datatypes to oimo datatypes
 * @param { THREE.Vector3, THREE.Quaternion } a
 * @return { OIMO.Vec3, OIMO.Quaternion }
 **/
export function ThreeToOimo(a) {
    //todo: implement this stuff
}

export const IdentityScaleVector = new THREE.Vector3(1, 1, 1);