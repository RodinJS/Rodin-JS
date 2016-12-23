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
        //case (new OIMO.Mat44()).constructor:
        //    return new THREE.Vector4(a.x, a.y, a.z, a.w);
        //case (new Array()).constructor:
        case (new Float32Array).constructor:
            let res;

            if (a.length === 16)
                res = new THREE.Matrix4();
            else if (a.length === 9)
                res = new THREE.Matrix3();
            else
                return undefined;

            res.fromArray(a);
            return res;

        case (new OIMO.Mat33()).constructor:

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
    switch (a.constructor) {
        case (new THREE.Quaternion()).constructor:
            return new OIMO.Quaternion(a.x, a.y, a.z, a.w);


    }
}

export const IdentityScaleVector = new THREE.Vector3(1, 1, 1);