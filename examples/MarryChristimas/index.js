import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {Snow} from '../../_build/js/rodinjs/sculpt/Snow.js';
import {JDModelObject} from '../../_build/js/rodinjs/sculpt/JDModelObject.js';
import {JSONModelObject} from '../../_build/js/rodinjs/sculpt/JSONModelObject.js';
import {OBJModelObject} from '../../_build/js/rodinjs/sculpt/OBJModelObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {ViveController} from '../../_build/js/rodinjs/controllers/ViveController.js';
import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {EVENT_NAMES} from '../../_build/js/rodinjs/constants/constants.js'


let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let threeScene = scene.scene;


renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = false;


scene.setCameraProperty("far", 200);

//threeScene.fog = new THREE.Fog(0x7a8695, 0, 23);

/// mouse controller

let mouseController = new MouseController();
mouseController.onControllerUpdate = mouseControllerUpdate;
SceneManager.addController(mouseController);


/// vive controllers

let controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, threeScene, null, 2);
controllerL.standingMatrix = controls.getStandingMatrix();

/*controllerL.onKeyDown = controllerKeyDown;
 controllerL.onKeyUp = controllerKeyUp;
 controllerL.onTouchUp = controllerTouchUp;
 controllerL.onTouchDown = controllerTouchDown;*/

SceneManager.addController(controllerL);

//scene.add(controllerL);

let controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, threeScene, null, 3);
controllerR.standingMatrix = controls.getStandingMatrix();

/*controllerR.onKeyDown = controllerKeyDown;
 controllerR.onKeyUp = controllerKeyUp;
 controllerR.onTouchUp = controllerTouchUp;
 controllerR.onTouchDown = controllerTouchDown;*/

SceneManager.addController(controllerR);

//scene.add(controllerR);

/*let loader = new THREE.OBJLoader();
 loader.setPath('./models/');
 loader.load('vr_controller_vive_1_5.obj', function (object) {

 let loader = new THREE.TextureLoader();
 loader.setPath('./img/');

 object.children[0].material.map = loader.load('onepointfive_texture.png');
 object.children[0].material.specularMap = loader.load('onepointfive_spec.png');

 controllerL.add(object.clone());
 controllerR.add(object.clone());
 });*/


/// Add light
//let light1 = new THREE.DirectionalLight(0xbbbbbb);
//light1.position.set(0, 3, 1);
//light1.castShadow = true;
//light1.shadow.camera.top = 15;
//light1.shadow.camera.bottom = -15;
//light1.shadow.camera.right = 15;
//light1.shadow.camera.left = -15;
//light1.shadow.mapSize.set(2048, 2048);
//scene.add(light1);

scene.add(new THREE.AmbientLight(0xaaaaaa, 0.5));


let boxSize = 30;
let snowBoxSize = 18;

// Add a skybox.
/*let skybox = new THREE.Mesh(new THREE.BoxGeometry(boxSize * 2, boxSize * 2, boxSize * 2), new THREE.MeshBasicMaterial({color: 0x000000}));
 skybox.position.y = controls.userHeight;
 skybox.scale.set(1, 1, -1);
 scene.add(skybox);*/

boxSize = 21;

// Add a snowContainer.
/*let snowContainer = new THREE.Object3D();
 snowContainer.rotation.y = -Math.PI / 2;
 snowContainer.position.y = -boxSize / 2 + snowBoxSize / 2;
 scene.add(snowContainer);*/

/// Add snow
/*
 let snow = new Snow(0,
 'img/particle_snow2.png',
 snowBoxSize,
 0.03,
 3,
 0.2,
 1
 );

 snow.on("ready", (evt) => {
 evt.target.object3D.renderOrder = 1;
 snowContainer.add(evt.target.object3D);
 });*/

// christmasRoom
let s = 0.026;
let christmasRoom = new JDModelObject(0, './models/ChristmasRoom.JD');
christmasRoom.on('ready', () => {
    christmasRoom.object3D.children[0].material.materials[0].alphaTest = 0.35;
    christmasRoom.object3D.children[0].material.materials[0].transparent = false;
    christmasRoom.object3D.children[0].material.materials[0].side = THREE.DoubleSide;
    christmasRoom.object3D.children[0].material.materials[0].clipShadows = true;

    christmasRoom.object3D.scale.set(s, s, s);
    christmasRoom.object3D.position.z = 5;

    christmasRoom.object3D.castShadow = true;
    christmasRoom.object3D.receiveShadow = true;
    scene.add(christmasRoom.object3D);
});

let christmasFire = new JDModelObject(1, './models/fire.JD');
//let christmasRoom = new JSONModelObject(0, './models/ChristmasRoom.js');

christmasFire.on('ready', () => {

    let txt = new THREE.TextureLoader();
    txt.load(
        'models/fire.jpg',
        function (texture) {
            christmasFire.object3D.children[0].material.materials[0] = new THREE.MeshBasicMaterial({
                map: texture,
                skinning: true
            });
            console.log(christmasFire.object3D.children[0].material.materials[0]);
        }
    );

    christmasFire.object3D.scale.set(s, s, s);
    christmasFire.object3D.position.z = 5;

    christmasFire.object3D.castShadow = false;
    christmasFire.object3D.receiveShadow = false;
    scene.add(christmasFire.object3D);
});

let fireLight1 = new RODIN.THREEObject(new THREE.PointLight(0xff983c, 5, 1));
fireLight1.on('ready', (evt) => {
    fireLight1.object3D.position.set(0.2, 0.7, -5);
//fireLight1.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10)));
    scene.add(fireLight1.object3D);
});

let animations = [
    new Animation('light1', {
        intensity: 5
    }),
    new Animation('light2', {
        intensity: 4
    }),
    new Animation('light3', {
        intensity: 3
    }),
    new Animation('light4', {
        intensity: 6
    }),
    new Animation('light5', {
        intensity: 4.5
    })
];

for(let i = 0; i < animations.length; i ++) {
    animations[i].duration(200);
    fireLight1.animator.add(animations[i]);
}

fireLight1.animator.start('light1');
fireLight1.on(EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {
    let play = animations[Math.randomIntIn(0, animations.length - 1)].name;
    fireLight1.animator.start(play);
});

/*/// Add terrain
 let terrain = new JSONModelObject(0, "./models/terrain.json");
 terrain.on('ready', () => {
 let textureSnow = new THREE.TextureLoader().load("./models/snow_texture.jpg");
 textureSnow.wrapS = THREE.RepeatWrapping;
 textureSnow.wrapT = THREE.RepeatWrapping;
 textureSnow.repeat.x = 15;
 textureSnow.repeat.y = 15;
 let mesh = new THREE.Mesh(terrain.object3D.geometry,
 new THREE.MeshLambertMaterial({
 color: 0xbbbbbb,
 map: textureSnow,
 clipShadows: true
 }));

 mesh.scale.set(0.3, 0.4, 0.3);
 mesh.castShadow = true;
 mesh.receiveShadow = true;
 scene.add(mesh);
 });*/

/*// christmasTree
 let s = 0.05;
 let christmasTree = new JSONModelObject(0, './models/christmasTree.json');
 christmasTree.on('ready', () => {
 christmasTree.object3D.material.materials[0].alphaTest = 0.35;
 christmasTree.object3D.material.materials[0].transparent = false;
 christmasTree.object3D.material.materials[0].side = THREE.DoubleSide;
 christmasTree.object3D.material.materials[0].clipShadows = true;

 christmasTree.object3D.scale.set(s, s, s);
 christmasTree.object3D.position.x = 0.5;
 christmasTree.object3D.position.y = 0;
 christmasTree.object3D.position.z = 0.5;

 christmasTree.object3D.castShadow = true;
 christmasTree.object3D.receiveShadow = true;
 scene.add(christmasTree.object3D);
 });*/

/*// random tree
 let tree = new JSONModelObject(0, './models/tree.json');
 tree.on('ready', () => {
 for (let i = 0; i < 25; i++) {
 let s = Math.randomFloatIn(0.05, 0.15);
 let t = tree.object3D.clone();
 let alpha = Math.randomFloatIn(-Math.PI, Math.PI);

 t.position.x = (Math.sin(alpha) + s) * Math.randomFloatIn(9, 20);
 t.position.y = 0;
 t.position.z = (Math.cos(alpha) + s) * Math.randomFloatIn(9, 20);
 t.rotation.y = (Math.random() - 0.5) * 2 * Math.PI / 2;
 t.scale.set(s, s, s);

 t.castShadow = true;
 t.receiveShadow = true;
 scene.add(t);
 }
 });*/

/*
 // christmasTree toys
 let toyURLS = [
 ];
 let toyReady = function () {
 let obj = new RODIN.THREEObject(this.object3D);
 let k = Math.randomFloatIn(-0.1, -1.0);
 let alpha = Math.randomFloatIn(-Math.PI, Math.PI);

 obj.object3D.position.x = (Math.sin(alpha) + s) * k;
 obj.object3D.position.y = s;
 obj.object3D.position.z = (Math.cos(alpha) + s) * k;
 obj.object3D.rotation.y = (Math.random() - 0.5) * 2 * Math.PI / 2;
 obj.object3D.scale.set(s, s, s);

 obj.object3D.castShadow = true;
 obj.object3D.receiveShadow = true;

 scene.add(obj.object3D);
 RODIN.Raycastables.push(obj.object3D);
 obj.object3D.initialParent = obj.object3D.parent;

 // hover
 obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
 if (evt.controller instanceof ViveController) {
 if (!obj.hoveringObjects) {
 obj.hoveringObjects = [];
 }
 if (obj.hoveringObjects.indexOf(evt.controller) > -1) return;
 obj.hoveringObjects.push(evt.controller);
 }

 if (evt.controller instanceof MouseController) {
 }
 });

 obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
 if (evt.controller instanceof ViveController) {
 if (obj.hoveringObjects.indexOf(evt.controller) > -1) {
 obj.hoveringObjects.splice(obj.hoveringObjects.indexOf(evt.controller));
 }
 if (obj.hoveringObjects.length !== 0 || obj.object3D.parent !== obj.object3D.initialParent) {
 return;
 }
 }

 if (evt.controller instanceof MouseController) {
 }
 });

 // CONTROLLER_KEY
 obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
 let controller = evt.controller;
 let target = evt.target;
 if (controller instanceof MouseController) {
 controller.pickedItems.push(target.object3D);

 let initParent = target.object3D.parent;
 changeParent(target.object3D, threeScene);

 target.object3D.raycastCameraPlane = new THREE.Plane();
 target.object3D.offset = new THREE.Vector3();
 target.object3D.intersection = new THREE.Vector3();

 target.object3D.raycastCameraPlane.setFromNormalAndCoplanarPoint(
 camera.getWorldDirection(target.object3D.raycastCameraPlane.normal),
 target.object3D.position
 );

 if (controller.raycaster.ray.intersectPlane(target.object3D.raycastCameraPlane, target.object3D.intersection)) {
 target.object3D.offset.copy(target.object3D.intersection).sub(target.object3D.position);
 if (evt.keyCode === 3) {
 let initParent = target.object3D.parent;
 changeParent(target.object3D, camera);
 target.object3D.initRotation = target.object3D.rotation.clone();
 target.object3D.initMousePos = {x: controller.axes[0], y: controller.axes[1]};
 changeParent(target.object3D, initParent);
 }
 }
 changeParent(target.object3D, initParent);
 }
 else if (controller instanceof ViveController) {
 if (target.object3D.parent != target.object3D.initialParent) {
 return;
 }
 changeParent(target.object3D, controller.reycastingLine);
 //let targetParent = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.04, 12, 12));
 let targetParent = new THREE.Object3D();
 controller.reycastingLine.add(targetParent);
 targetParent.position.copy(target.object3D.position);
 changeParent(target.object3D, targetParent);

 controller.pickedItems.push(target.object3D);
 if (target.initialRotX) {
 target.initialRotX = 0;
 target.initialRotY = 0;
 }
 }
 });

 obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
 let controller = evt.controller;
 let target = evt.target;
 if (controller instanceof MouseController) {
 }
 else if (controller instanceof ViveController) {
 let targetParent = target.object3D.parent;
 changeParent(target.object3D, target.object3D.initialParent);
 controller.reycastingLine.remove(targetParent);
 }
 });

 obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_VALUE_CHANGE, (evt) => {


 let controller = evt.controller;
 let target = evt.target;
 if (controller instanceof MouseController) {
 let gamePad = MouseController.getGamepad();
 if (evt.keyCode === 2) {
 let initParent = target.object3D.parent;
 changeParent(target.object3D, camera);
 target.object3D.position.z -= gamePad.buttons[evt.keyCode - 1].value / 1000;
 gamePad.buttons[evt.keyCode - 1].value = 0;
 changeParent(target.object3D, initParent);
 }
 }


 });

 obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK, (evt) => {
 if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY1) {
 }
 if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) {
 }
 });

 // Controller touch
 obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_START, (evt) => {
 });

 obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_END, (evt) => {
 });

 obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TAP, (evt) => {
 });
 };
 let colors = [0x0d2a70, 0x690000, 0xd2d2d2];
 for (let i = 0; i < 10; i++) {
 let url = toyURLS[Math.randomIntIn(0, 5)];
 let toy = new JSONModelObject(i, url);

 toy.on('ready', toyReady);
 toy.on('ready', () => {
 toy.object3D.geometry.computeVertexNormals();

 toy.object3D.material.materials[0].reflectivity = 1;
 toy.object3D.material.materials[0].hue = 1;
 if (url !== toyURLS[1]) {
 toy.object3D.material.materials[0].color = new THREE.Color(colors[Math.randomIntIn(0, colors.length - 1)]);
 }
 }
 )
 }

 let toy = new JSONModelObject(10, toyURLS[6]);
 toy.on('ready', toyReady);
 toy.on('ready', () => {
 toy.object3D.geometry.center();
 let toyGeo = toy.object3D.geometry.clone();
 let glowMat = new THREE.MeshStandardMaterial({
 map: new THREE.TextureLoader().load("./models/star.png"),
 lights: true,
 blending: THREE.AdditiveBlending,
 opacity: 0.75,
 transparent: true
 });
 let toyGlow = new THREE.Mesh(toyGeo, glowMat);
 toyGlow.scale.multiplyScalar(1.5);
 toyGlow.geometry.center();
 toy.object3D.add(toyGlow);
 console.log(toyGlow);
 });
 */
/*
 function controllerKeyDown(keyCode) {
 if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
 this.engaged = true;
 if (!this.pickedItems) {
 this.pickedItems = [];
 }
 }

 function controllerKeyUp(keyCode) {
 if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
 this.engaged = false;
 if (this.pickedItems && this.pickedItems.length > 0) {
 this.pickedItems = [];
 }
 }

 function controllerTouchDown(keyCode, gamepad) {

 if (!this.engaged || keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY1) return;

 if (this.intersected && this.intersected.length > 0) {
 this.intersected.map(intersect => {
 if (!gamepad.initialTouchX && gamepad.initialTouchX != 0) {
 gamepad.initialTouchX = -gamepad.axes[1];
 gamepad.initialTouchY = -gamepad.axes[0];
 }

 if (!intersect.initialRotX && intersect.initialRotX != 0) {
 intersect.initialRotX = +intersect.object3D.parent.rotation.x;
 intersect.initialRotY = +intersect.object3D.parent.rotation.y;
 }
 let x = (intersect.initialRotX + ((-gamepad.axes[1]) - gamepad.initialTouchX));
 let y = (intersect.initialRotY + ((-gamepad.axes[0]) - gamepad.initialTouchY));

 let directionY = new THREE.Vector3(0, 1, 0).normalize();
 let quaternionY = new THREE.Quaternion();
 quaternionY.setFromAxisAngle(directionY, -y);

 let directionX = new THREE.Vector3(1, 0, 0).normalize();
 let quaternionX = new THREE.Quaternion();
 quaternionX.setFromAxisAngle(directionX, x);

 intersect.object3D.parent.updateMatrixWorld();
 intersect.object3D.parent.quaternion.copy(new THREE.Quaternion().multiplyQuaternions(quaternionX, quaternionY));
 });
 }
 }

 function controllerTouchUp(keyCode, gamepad) {
 if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY1) return;
 if (this.intersected && this.intersected.length > 0) {
 this.intersected.map(intersect => {
 gamepad.initialTouchX = null;
 gamepad.initialTouchZ = null;
 intersect.initialRotX = 0;
 intersect.initialRotY = 0;

 let holderObj = intersect.object3D.parent;
 changeParent(intersect.object3D, intersect.object3D.initialParent);
 holderObj.rotation.set(0, 0, 0);
 changeParent(intersect.object3D, holderObj);
 });
 }
 }*/

function mouseControllerUpdate() {
    this.raycaster.setFromCamera({x: this.axes[0], y: this.axes[1]}, camera);

    if (this.pickedItems && this.pickedItems.length > 0) {
        this.pickedItems.map(item => {
            if (this.raycaster.ray.intersectPlane(item.raycastCameraPlane, item.intersection)) {
                if (this.keyCode === 1) {
                    let initParent = item.parent;
                    changeParent(item, threeScene);
                    item.position.copy(item.intersection.sub(item.offset));
                    changeParent(item, initParent);
                } else if (this.keyCode === 3) {
                    let shift = {x: this.axes[0] - item.initMousePos.x, y: this.axes[1] - item.initMousePos.y};
                    item.initMousePos = {x: this.axes[0], y: this.axes[1]};
                    let initParent = item.parent;
                    changeParent(item, camera);
                    let deltaRotationQuaternion = new THREE.Quaternion()
                        .setFromEuler(
                            new THREE.Euler(-shift.y * Math.PI, shift.x * Math.PI, 0, 'XYZ')
                        );

                    item.quaternion.multiplyQuaternions(deltaRotationQuaternion, item.quaternion);

                    changeParent(item, initParent);
                }
            }
        });
    }
}