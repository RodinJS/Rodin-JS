import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import '../../vendor/oimo/oimo.js';

/**
 *
 * @param { THREE.Object3D ||  OIMO.RigidBody} object
 * @param { THREE.Object3D ||  OIMO.RigidBody} targetParent
 */
export default function changeParent(object = null, targetParent = null) {
    // TODO change as rodinphysics update

    let currParent;
    let initPos;
    let initQuat;
    let initScale;

    if (object instanceof THREE.Object3D) {
        currParent = object.parent;
        initPos = object.getWorldPosition();
        initQuat = object.getWorldQuaternion();
        initScale = object.getWorldScale();

        currParent && currParent.remove(object);
        object.position.copy(initPos);
        object.quaternion.copy(initQuat);
        object.scale.copy(initScale);
        object.updateMatrixWorld();

        targetParent.updateMatrixWorld();
        object.applyMatrix(new THREE.Matrix4().getInverse(targetParent.matrixWorld));
        targetParent.add(object);
    }
    if (object.body instanceof OIMO.RigidBody) {
    }

}

