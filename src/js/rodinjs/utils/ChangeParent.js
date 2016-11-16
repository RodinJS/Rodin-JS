import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
/**
*
* @param { THREE.Object3D } object
* @param { THREE.Object3D } targetParent
*/
export default function changeParent(  object = null, targetParent = null ) {

    let currParent = object.parent;
    let initPos = object.getWorldPosition();
    let initQuat = object.getWorldQuaternion();
    let initScale = object.getWorldScale();

    currParent.remove( object );
    object.position.copy( initPos );
    object.quaternion.copy( initQuat );
    object.scale.copy( initScale );
    object.updateMatrixWorld();

    targetParent.updateMatrixWorld();
    object.applyMatrix( new THREE.Matrix4().getInverse( targetParent.matrixWorld ) );
    targetParent.add( object );

}

