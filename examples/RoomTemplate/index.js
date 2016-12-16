import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';

import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {DragAndDrop} from './DragAndDrop_c.js';

import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {EVENT_NAMES, CONTROLLER_HANDS} from '../../_build/js/rodinjs/constants/constants.js';

import './ViveControllers_c.js';

let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;

renderer.setPixelRatio(window.devicePixelRatio);
scene.setCameraProperty("far", 100);

/// mouse controller
let mouseController = new MouseController();
SceneManager.addController(mouseController);

mouseController.onControllerUpdate = DragAndDrop.controllerUpdate;
let skybox = new CubeObject(50, 'models/textures/skybox.jpg');

skybox.on('ready', () => {
    skybox.object3D.position.y = controls.userHeight;
    skybox.object3D.rotation.y = Math.PI;
    scene.add(skybox.object3D);
});

/// Add lights
let light1 = new THREE.DirectionalLight(0xcccccc, 0.25);
light1.position.set(1.119, 2.872, 2.775);
light1.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({color: 0xfff5eb})));
scene.add(light1);

let light2 = new THREE.DirectionalLight(0xcccccc, 0.25);
light2.position.set(-1.865, 2.872, 2.775);
light2.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({color: 0xfff5eb})));
scene.add(light2);

let light3 = new THREE.DirectionalLight(0xcccccc, 0.25);
light3.position.set(1.863, 2.872, 1.454);
light3.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({color: 0xfff5eb})));
scene.add(light3);

let light4 = new THREE.DirectionalLight(0xcccccc, 0.25);
light4.position.set(-1.863, 2.872, 1.454);
light4.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({color: 0xfff5eb})));
scene.add(light4);

let light5 = new THREE.DirectionalLight(0xcccccc, 0.25);
light5.position.set(1.865, 2.872, -1.454);
light5.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({color: 0xfff5eb})));
scene.add(light5);

let light6 = new THREE.DirectionalLight(0xcccccc, 0.25);
light6.position.set(-1.865, 2.872, -1.454);
light6.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({color: 0xfff5eb})));
scene.add(light6);

let light7 = new THREE.DirectionalLight(0xcccccc, 0.25);
light7.position.set(-1.865, 2.872, -2.775);
light7.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({color: 0xfff5eb})));
scene.add(light7);

let light8 = new THREE.DirectionalLight(0xcccccc, 0.25);
light8.position.set(1.865, 2.872, -2.775);
light8.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({color: 0xfff5eb})));
scene.add(light8);

scene.add(new THREE.AmbientLight(0xd9d9d9, 0.3));

// loading 3D models 

// room
let room = ModelLoader.load('./models/Room.obj');
room.on('ready', () => {
    scene.add(room.object3D);
});
// sofa_01
let sofa_01 = ModelLoader.load('./models/sofa_01.obj');
sofa_01.on('ready', () => {
    scene.add(sofa_01.object3D);
    createRaycastablesObjects(sofa_01);
});

// sofa_02
let sofa_02 = ModelLoader.load('./models/sofa_02.obj');
sofa_02.on('ready', () => {
    scene.add(sofa_02.object3D);
    createRaycastablesObjects(sofa_02);
});
// table
let table = ModelLoader.load('./models/table.obj');
table.on('ready', () => {
    scene.add(table.object3D);
    createRaycastablesObjects(table);
});
// books
let books = ModelLoader.load('./models/books.obj');
books.on('ready', () => {
    scene.add(books.object3D);
    createRaycastablesObjects(books);
});
// vases
let vases = ModelLoader.load('./models/vases.obj');
vases.on('ready', () => {
    scene.add(vases.object3D);
    createRaycastablesObjects(vases);
});
// apples
let apples = ModelLoader.load('./models/apples.obj');
apples.on('ready', () => {
    scene.add(apples.object3D);
    createRaycastablesObjects(apples);
});
// picture_wall
let picture_wall = ModelLoader.load('./models/picture_wall.obj');
picture_wall.on('ready', () => {
    scene.add(picture_wall.object3D);
    createRaycastablesObjects(picture_wall);
});
// picture_table
let picture_table = ModelLoader.load('./models/picture_table.obj');
picture_table.on('ready', () => {
    scene.add(picture_table.object3D);
    createRaycastablesObjects(picture_table);
});
// TV
let TV = ModelLoader.load('./models/TV.obj');
TV.on('ready', () => {
    scene.add(TV.object3D);
    createRaycastablesObjects(TV);
});

function createRaycastablesObjects(model) {
    let raycastablesObjectsLenght = model.object3D.children.length;

    for (let i = 0; i < raycastablesObjectsLenght; i++) {
        let mesh = model.object3D.children[i];
        if (mesh instanceof THREE.Mesh) {

            let fn = function(){
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
                scene.postRenderFunctions.splice(scene.postRenderFunctions.indexOf(fn),1);
            };
            scene.postRender( fn );

            let raycastableObj = new RODIN.THREEObject(mesh);
            raycastableObj.object3D.initialParent = raycastableObj.object3D.parent;
            RODIN.Raycastables.push(raycastableObj.object3D);
            raycastableObj.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, DragAndDrop.controllerKeyDown);
            raycastableObj.on(EVENT_NAMES.CONTROLLER_VALUE_CHANGE, DragAndDrop.controllerValueChange);
        }
    }
}


