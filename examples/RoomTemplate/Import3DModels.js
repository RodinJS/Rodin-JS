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
    crateRoomCollision();
});
// sofa_01
export const sofa_01 = ModelLoader.load('./models/sofa_01.obj');
sofa_01.on('ready', () => {
    scene.add(sofa_01.object3D);
    createRaycastablesObjects(sofa_01);
});

// sofa_02
export const sofa_02 = ModelLoader.load('./models/sofa_02.obj');
sofa_02.on('ready', () => {
    scene.add(sofa_02.object3D);
    createRaycastablesObjects(sofa_02);
});

// table
export const table = ModelLoader.load('./models/table.obj');
table.on('ready', () => {
    scene.add(table.object3D);
    createRaycastablesObjects(table);
});

// books
export const books = ModelLoader.load('./models/books.obj');
books.on('ready', () => {
    scene.add(books.object3D);
    createRaycastablesObjects(books);
});

// vases
export const vases = ModelLoader.load('./models/vases.obj');
vases.on('ready', () => {
    scene.add(vases.object3D);
    createRaycastablesObjects(vases);
});

// apples
export const apples = ModelLoader.load('./models/apples.obj');
apples.on('ready', () => {
    scene.add(apples.object3D);
    createRaycastablesObjects(apples);
});

/*// picture_wall
let picture_wall = ModelLoader.load('./models/picture_wall.obj');
picture_wall.on('ready', () => {
    scene.add(picture_wall.object3D);
    createRaycastablesObjects(picture_wall);
});*/

// firePlace
export const fire_place = ModelLoader.load('./models/FirePlace.obj');
fire_place.on('ready', () => {
    scene.add(fire_place.object3D);
    createRaycastablesObjects(fire_place);
});

// picture_table
export const picture_table = ModelLoader.load('./models/picture_table.obj');
picture_table.on('ready', () => {
    scene.add(picture_table.object3D);
    createRaycastablesObjects(picture_table);
});


function createRaycastablesObjects(model) {

    let raycastablesObjectsLength = model.object3D.children.length;

    for (let i = 0; i < raycastablesObjectsLength; i++) {
        let mesh = model.object3D.children[i];
        if (mesh instanceof THREE.Mesh) {

            let calcRealCenterOfObject = function () {
                let boundingSpherePos = new THREE.Vector3(
                    mesh.geometry.boundingSphere.center.x,
                    mesh.geometry.boundingSphere.center.y,
                    mesh.geometry.boundingSphere.center.z
                );
                mesh.position.set(
                    boundingSpherePos.x,
                    boundingSpherePos.y,
                    boundingSpherePos.z
                );
                mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(
                    -boundingSpherePos.x,
                    -boundingSpherePos.y,
                    -boundingSpherePos.z
                ));

                // add rigit body
                let rigitBody = new RigidBody({
                    owner: mesh,
                    mass: 0.2,
                    type: 'box',
                    move: true
                });
                rigitBody.name = mesh.name;
                model.rigidBody = rigitBody;

                // remove calcRealCenterOfObject function
                scene.postRenderFunctions.splice(scene.postRenderFunctions.indexOf(calcRealCenterOfObject), 1);
            };
            scene.postRender(calcRealCenterOfObject);

            let raycastableObj = new RODIN.THREEObject(mesh);
            raycastableObj.object3D.initialParent = raycastableObj.object3D.parent;
            raycastableObj.raycastable = true;
            raycastableObj.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, DragAndDrop.controllerKeyDown);
            raycastableObj.on(EVENT_NAMES.CONTROLLER_VALUE_CHANGE, DragAndDrop.controllerValueChange);
        }
    }
}

function crateRoomCollision() {
    let floor = new THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(7, 8)));
    floor.on('ready', () => {
        floor.object3D.rotation.x = Math.PI / 2;
        floor.object3D.position.set(0, 0, 0);
        scene.add(floor.object3D);

        // add physic
        let floorRigitBody = new RigidBody({
            owner: floor.object3D,
            mass: 0,
            type: "plane",
            move: false
        });
        floorRigitBody.name = "floor";
    });

    /*let wallFront = new THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(7, 3)));
    wallFront.on('ready', () => {
        floor.object3D.rotation.y = Math.PI;
        wallFront.object3D.position.set(0, 1.5, -4);
        scene.add(wallFront.object3D);

        // add physic
        let wallFrontRigitBody = new RigidBody({
            owner: floor.object3D,
            mass: 0,
            type: "plane",
            move: false
        });
        wallFrontRigitBody.name = "wallFront";
    });
    let wallBack = new THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(7, 3)));
    wallBack.on('ready', () => {
        wallBack.object3D.rotation.y = Math.PI;
        wallBack.object3D.position.set(0, 1.5, 4);
        scene.add(wallBack.object3D);

        // add physic
        let wallBackRigitBody = new RigidBody({
            owner: floor.object3D,
            mass: 0,
            type: "plane",
            move: false
        });
        wallBackRigitBody.name = "wallBack";
    });
    let wallBackSmall = new THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(1, 3)));
    wallBackSmall.on('ready', () => {
        wallBackSmall.object3D.rotation.y = Math.PI;
        wallBackSmall.object3D.position.set(3, 1.5, 2.5);
        scene.add(wallBackSmall.object3D);

        // add physic
        let wallBackSmallRigitBody = new RigidBody({
            owner: floor.object3D,
            mass: 0,
            type: "plane",
            move: false
        });
        wallBackSmallRigitBody.name = "wallBackSmall";
    });

    let wallRight = new THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(8, 3)));
    wallRight.on('ready', () => {
        wallRight.object3D.rotation.y = -Math.PI/2;
        wallRight.object3D.position.set(3.5, 1.5, 0);
        scene.add(wallRight.object3D);

        // add physic
        let wallRightRigitBody = new RigidBody({
            owner: floor.object3D,
            mass: 0,
            type: "plane",
            move: false
        });
        wallRightRigitBody.name = "wallRight";
    });

    let wallRightSmall = new THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(1.5, 3)));
    wallRightSmall.on('ready', () => {
        wallRightSmall.object3D.rotation.y = -Math.PI/2;
        wallRightSmall.object3D.position.set(2.5, 1.5, 3.25);
        scene.add(wallRightSmall.object3D);

        // add physic
        let wallRightSmallRigitBody = new RigidBody({
            owner: floor.object3D,
            mass: 0,
            type: "plane",
            move: false
        });
        wallRightSmallRigitBody.name = "wallRightSmall";
    });

    let wallLeft = new THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(8, 3)));
    wallLeft.on('ready', () => {
        wallLeft.object3D.rotation.y = Math.PI/2;
        wallLeft.object3D.position.set(-3.5, 1.5, 0);
        scene.add(wallLeft.object3D);

        // add physic
        let wallLeftRigitBody = new RigidBody({
            owner: floor.object3D,
            mass: 0,
            type: "plane",
            move: false
        });
        wallLeftRigitBody.name = "wallLeft";
    });

    //ceiling
    let ceiling = new THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(7, 8)));
    ceiling.on('ready', () => {
        ceiling.object3D.position.set(0, 3, 0);
        ceiling.object3D.rotation.x = Math.PI/2;
        scene.add(ceiling.object3D);

        // add physic
        let ceilingRigitBody = new RigidBody({
            owner: floor.object3D,
            mass: 0,
            type: "plane",
            move: false
        });
        ceilingRigitBody.name = "ceiling";
    });*/
}