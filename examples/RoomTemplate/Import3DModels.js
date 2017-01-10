import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';
import {THREEObject} from '../../_build/js/rodinjs/sculpt/THREEObject.js';

import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {DragAndDrop} from './DragAndDrop_c.js';

import {RigidBody} from '../../_build/js/rodinjs/physics/RigidBody.js';
import {RodinPhysics} from '../../_build/js/rodinjs/physics/RodinPhysics.js';

import {EVENT_NAMES, CONTROLLER_HANDS} from '../../_build/js/rodinjs/constants/constants.js';

let scene = SceneManager.get();

// room
export const room = ModelLoader.load('./models/Room.obj');
room.on('ready', () => {
    scene.add(room.object3D);

    // room collision
    let roomCollision = ModelLoader.load('./models/RoomCollision.obj');
    roomCollision.on('ready', () => {
        scene.add(roomCollision.object3D);
        createRaycastableRigidBody(roomCollision, 'box', 0, false);
    });
});

// sofa_01
export const sofa_01 = ModelLoader.load('./models/sofa_01.obj');
sofa_01.on('ready', () => {
    scene.add(sofa_01.object3D);
    createRaycastableRigidBody(sofa_01, 'box', 1, true, true);
});

// sofa_02
export const sofa_02 = ModelLoader.load('./models/sofa_02.obj');
sofa_02.on('ready', () => {
    scene.add(sofa_02.object3D);
    createRaycastableRigidBody(sofa_02, 'box', 1, true, true);
});

// table
export const table = ModelLoader.load('./models/table.obj');
table.on('ready', () => {
    scene.add(table.object3D);
    createRaycastableRigidBody(table, 'box', 0.1, true, true);
});

// books
export const books = ModelLoader.load('./models/books.obj');
books.on('ready', () => {
    scene.add(books.object3D);
    createRaycastableRigidBody(books, 'box', 0.01, true, false);
});

// vases
export const vases = ModelLoader.load('./models/vases.obj');
vases.on('ready', () => {
    scene.add(vases.object3D);
    createRaycastableRigidBody(vases, 'box', 0.02, true, true);
});

// apples
export const apples = ModelLoader.load('./models/apples.obj');
apples.on('ready', () => {
    scene.add(apples.object3D);
    createRaycastableRigidBody(apples, 'sphere', 0.001, true, false);
});

// firePlace
export const fire_place = ModelLoader.load('./models/FirePlace.obj');
fire_place.on('ready', () => {
    scene.add(fire_place.object3D);
    createRaycastableRigidBody(fire_place, 'box', 0, false);
});

// picture_table
export const picture_table = ModelLoader.load('./models/picture_table.obj');
picture_table.on('ready', () => {
    scene.add(picture_table.object3D);
    createRaycastableRigidBody(picture_table, 'box', 0.02, true, true);
});

function createRaycastableRigidBody(model, type, mass, move, groupRaycasting) {

    if (!model.object3D.children) return;
    let raycastablesObjectsLength = model.object3D.children.length;

    for (let i = 0; i < raycastablesObjectsLength; i++) {
        let mesh = model.object3D.children[i];
        if (mesh instanceof THREE.Mesh) {
            let rodinObject = new RODIN.THREEObject(mesh);

            // need calculate geometry's bounding sphere and get it's center
            // for calculating real center of object,
            // "obj" format get (0, 0, 0) coordinate as center of object
            let calcRealCenterOfObject = function () {
                // get bounding sphere position
                let boundingSpherePos = new THREE.Vector3(
                    mesh.geometry.boundingSphere.center.x,
                    mesh.geometry.boundingSphere.center.y,
                    mesh.geometry.boundingSphere.center.z
                );
                // shift mesh to bounding sphere position
                mesh.position.set(
                    boundingSpherePos.x,
                    boundingSpherePos.y,
                    boundingSpherePos.z
                );
                // shift geometry to mesh position
                mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(
                    -boundingSpherePos.x,
                    -boundingSpherePos.y,
                    -boundingSpherePos.z
                ));

                // add rigit body
                /*let rigitBody = new RigidBody({
                    owner: mesh,
                    mass: mass,
                    type: type,
                    move: move
                });
                rigitBody.name = mesh.name;
                mesh.rigidBody = rigitBody;*/

                // after once render we need remove calcRealCenterOfObject function
                scene.postRenderFunctions.splice(scene.postRenderFunctions.indexOf(calcRealCenterOfObject), 1);
            };

            // for calculating bounding sphere we need render scene once
            scene.postRender(calcRealCenterOfObject);

            // todo if it's need make raycastable model not mesh
            let raycastableObj;
            if (!groupRaycasting) {
                raycastableObj = new RODIN.THREEObject(mesh);
                console.log(mesh);
            } else {
                //
                raycastableObj = new RODIN.THREEObject(model.object3D);
                console.log(model.object3D);
            }

            raycastableObj.object3D.initialParent = raycastableObj.object3D.parent;
            // check if object movable make if raycastable
            if (move) {
                raycastableObj.raycastable = true;
                raycastableObj.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, DragAndDrop.controllerKeyDown);
                raycastableObj.on(EVENT_NAMES.CONTROLLER_VALUE_CHANGE, DragAndDrop.controllerValueChange);
            }
        }
    }
}

