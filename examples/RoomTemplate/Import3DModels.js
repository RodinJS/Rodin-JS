import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {THREEObject} from '../../_build/js/rodinjs/sculpt/THREEObject.js';

import {DragAndDrop} from './DragAndDrop_c.js';
import {controllerL, controllerR} from './DnDVive_c.js';
import {cardboardController}      from './DnDCardboard_c.js';
import {oculusController}         from './DnDOculus_c.js';
import {mouseController}          from './DnDMouse_c.js';

import {RigidBody} from '../../_build/js/rodinjs/physics/RigidBody.js';
import {RodinPhysics} from '../../_build/js/rodinjs/physics/RodinPhysics.js';

import {EVENT_NAMES} from '../../_build/js/rodinjs/constants/constants.js';

let scene = SceneManager.get();

// room
export const room = ModelLoader.load('./models/Room.obj');
room.on('ready', () => {
    for (let i = 0; i < room.object3D.children.length; i++) {
        let child = room.object3D.children[i];
        child.position.set(0, 0, 0);
    }
    scene.add(room.object3D);

    // room collision
    let roomCollision = ModelLoader.load('./models/RoomCollision.obj');
    roomCollision.on('ready', () => {
        for (let i = 0; i < roomCollision.object3D.children.length; i++) {
            let child = roomCollision.object3D.children[i];
            child.material.opacity = 0;

            switch (child.name) {
                case 'ceiling':
                    child.position.set(0, 4, 0);
                    break;
                case 'floor':
                    child.position.set(0, -1, 0);
                    break;
                case 'wallBack':
                    child.position.set(-1.5, 1.5, 5);
                    break;
                case 'wallFront':
                    child.position.set(0, 1.5, -5);
                    break;
                case 'wallLeft':
                    child.position.set(-4.5, 1.5, 0);
                    break;
                case 'wallRight':
                    child.position.set(4.5, 1.5, -0.75);
                    break;
                case 'wallRightSmall':
                    child.position.set(4, 1.5, 4.25);
                    break;
                default:
                    return
            }
        }
        scene.add(roomCollision.object3D);
        createRaycastableRigidBody(roomCollision, 'box', 0, false);
    });
});
//sofa_01

export const sofa_01 = ModelLoader.load('./models/sofa_01.obj');
sofa_01.on('ready', () => {
    for (let i = 0; i < sofa_01.object3D.children.length; i++) {
        let child = sofa_01.object3D.children[i];
        switch (child.name) {
            case 'sofa_01':
                child.position.set(-0.92, 0.328, 2.732);
                break;
            case 'sofa_01_detail':
                child.position.set(-1.948, 0.225, 1.434);
                break;
            default:
                return
        }
    }
    scene.add(sofa_01.object3D);
    createRaycastableRigidBody(sofa_01, 'box', 1, false);
});

//sofa_02
export const sofa_02 = ModelLoader.load('./models/sofa_02.obj');
sofa_02.on('ready', () => {
    for (let i = 0; i < sofa_02.object3D.children.length; i++) {
        let child = sofa_02.object3D.children[i];
        switch (child.name) {
            case 'sofa_02':
                child.position.set(2.797, 0.328, -0.782);
                //child.position.set(0, 2, -4);
                break;
            default:
                return
        }
    }
    scene.add(sofa_02.object3D);
    createRaycastableRigidBody(sofa_02, 'box', 1, false);

});
// table

export const table = ModelLoader.load('./models/table.obj');
table.on('ready', () => {
    for (let i = 0; i < table.object3D.children.length; i++) {
        let child = table.object3D.children[i];
        switch (child.name) {
            case 'table_01':
                child.position.set(1.318, 0.137, -0.694);
                break;
            case 'table_02':
                child.position.set(1.318, 0.326, -0.99);
                break;
            case 'table_03':
                child.position.set(1.318, 0.326, 0.058);
                break;
            case 'table_detail_00':
                child.position.set(0.912, 0.408, 0.079);
                break;
            case 'table_detail_01':
                child.position.set(1.339, 0.408, 0.38);
                break;
            case 'table_detail_02':
                child.position.set(1.724, 0.408, 0.037);
                break;
            case 'table_detail_03':
                child.position.set(1.297, 0.408, -0.264);
                break;
            default:
                return
        }
    }
    scene.add(table.object3D);
    createRaycastableRigidBody(table, 'box', 0.1, false);
});

// books
export const books = ModelLoader.load('./models/books.obj');
books.on('ready', () => {
    for (let i = 0; i < books.object3D.children.length; i++) {
        let child = books.object3D.children[i];
        switch (child.name) {
            case 'book_01':
                child.position.set(1.467, 0.388, -0.688);
                break;
            case 'book_02':
                child.position.set(0.771, 0.675, 2.757);
                break;
            case 'book_03':
                child.position.set(1.241, 0.406, -1.452);
                break;
            case 'book_04':
                child.position.set(1.251, 0.388, -1.433);
                break;
            case 'book_05':
                child.position.set(1.446, 0.42, -0.692);
                break;
            case 'book_06':
                child.position.set(1.417, 0.406, -0.696);
                break;
            case 'book_07':
                child.position.set(0.756, 0.77, 2.733);
                break;
            case 'book_08':
                child.position.set(0.767, 0.72, 2.751);
                break;
            default:
                return
        }
    }
    scene.add(books.object3D);
    createRaycastableRigidBody(books, 'box', 0.01, true);
});

// apples
export const apples = ModelLoader.load('./models/apples.obj');
apples.on('ready', () => {
    for (let i = 0; i < apples.object3D.children.length; i++) {
        let child = apples.object3D.children[i];
        switch (child.name) {
            case 'apple_01':
                child.position.set(1.483, 0.454, 0.17);
                break;
            case 'apple_02':
                child.position.set(1.387, 0.461, 0.133);
                break;
            case 'apple_03':
                child.position.set(1.476, 0.458, 0.027);
                break;
            case 'apple_04':
                child.position.set(1.445, 0.413, 0.138);
                break;
            case 'apple_05':
                child.position.set(1.493, 0.442, 0.1);
                break;
            case 'apple_06':
                child.position.set(1.426, 0.433, 0.067);
                break;
            default:
                return
        }
    }
    scene.add(apples.object3D);
    createRaycastableRigidBody(apples, 'sphere', 0.001, true);
});

// firePlace
export const fire_place = ModelLoader.load('./models/FirePlace.obj');
fire_place.on('ready', () => {
    for (let i = 0; i < fire_place.object3D.children.length; i++) {
        let child = fire_place.object3D.children[i];
        switch (child.name) {
            case 'FirePlace_01':
                child.position.set(0.011, 0.653, -3.738);
                break;
            case 'FirePlace_02':
                child.position.set(0.014, 2.121, -3.864);
                break;
            default:
                return
        }
    }
    scene.add(fire_place.object3D);
    createRaycastableRigidBody(fire_place, 'box', 0, false);
});

// picture_table
export const picture_table = ModelLoader.load('./models/picture_table.obj');
picture_table.on('ready', () => {
    for (let i = 0; i < picture_table.object3D.children.length; i++) {
        let child = picture_table.object3D.children[i];
        switch (child.name) {
            case 'picture_table':
                child.position.set(2.835, 0.759, 0.991);
                break;
            default:
                return
        }
    }
    picture_table.object3D.updateMatrixWorld();

    scene.add(picture_table.object3D);
    createRaycastableRigidBody(picture_table, 'box', 0.02, true);
});

// vases
export const vases = ModelLoader.load('./models/vases.obj');
vases.on('ready', () => {
    for (let i = 0; i < vases.object3D.children.length; i++) {
        let child = vases.object3D.children[i];
        switch (child.name) {
            case 'vase_01':
                child.position.set(-0.602, 1.48, -3.639);
                break;
            case 'vase_02':
                child.position.set(-0.292, 1.36, -3.61);
                break;
            case 'vase_03':
                child.position.set(1.453, 0.41, 0.101);
                break;
            case 'vase_04':
                child.position.set(-2.674, 0.83, 2.673);
                break;
            default:
                return
        }
    }
    scene.add(vases.object3D);
    createRaycastableRigidBody(vases, 'box', 0.02, true);
});

function createRaycastableRigidBody(model, type, mass, move) {

    if (!model.object3D.children) return;
    let raycastablesObjectsLength = model.object3D.children.length;
    for (let i = 0; i < raycastablesObjectsLength; i++) {

        if (model.object3D.children[i] instanceof THREE.Mesh) {
            let mesh = model.object3D.children[i];
            if (type) {
                let rigitBody = new RigidBody({
                    owner: mesh,
                    mass: mass,
                    type: type,
                    move: move
                });
                rigitBody.name = mesh.name;
                mesh.rigidBody = rigitBody;
            }

            let raycastableObj = new RODIN.THREEObject(mesh);
            raycastableObj.object3D.initialParent = raycastableObj.object3D.parent;

            // check if object movable make if raycastable
            if (move) {
                raycastableObj.raycastable = true;
                raycastableObj.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, DragAndDrop.objectKeyDown);
                raycastableObj.on(EVENT_NAMES.CONTROLLER_KEY_UP, DragAndDrop.objectKeyUp);
                raycastableObj.on(EVENT_NAMES.CONTROLLER_VALUE_CHANGE, DragAndDrop.objectValueChange);
            }
        }
    }
}

