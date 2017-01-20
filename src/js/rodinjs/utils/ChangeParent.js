import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import '../../vendor/oimo/oimo.js';

/**
 *
 * @param { THREE.Object3D } object
 * @param { THREE.Object3D } targetParent
 */
export default function changeParent(object = null, targetParent = null) {
    // TODO change as rodinphysics update

    if (object instanceof THREE.Object3D) {
        /*let globalMatrix = object.matrixWorld;
        let currParent = object.parent;
        currParent && currParent.remove(object);
        targetParent.add(object);
        setGlobalMatrix(object, globalMatrix);*/

        let currParent = object.parent;
        let initPos = object.getWorldPosition();
        let initQuat = object.getWorldQuaternion();
        let initScale = object.getWorldScale();

        currParent && currParent.remove(object);
        object.position.copy(initPos);
        object.quaternion.copy(initQuat);
        object.scale.copy(initScale);
        object.updateMatrixWorld();

        targetParent.updateMatrixWorld();
        object.applyMatrix(new THREE.Matrix4().getInverse(targetParent.matrixWorld));
        targetParent.add(object);
    }

}
//todo: fix this shit
function setGlobalMatrix(object, matrix){
    let inverseParentMatrix = new THREE.Matrix4();
    let newGlobalMatrix = matrix.clone();

    inverseParentMatrix.getInverse(object.parent.matrixWorld);
    newGlobalMatrix.multiplyMatrices(inverseParentMatrix, newGlobalMatrix);

    object.matrixAutoUpdate = false;
    object.matrix = newGlobalMatrix;
}
