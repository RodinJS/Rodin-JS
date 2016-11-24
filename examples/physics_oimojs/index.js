import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {THREEObject} from '../../_build/js/rodinjs/sculpt/THREEObject.js';
import {ViveController} from '../../_build/js/rodinjs/controllers/ViveController.js';
import {RigidBody} from '../../_build/js/rodinjs/physics/RigidBody.js';
import {RodinPhysics} from '../../_build/js/rodinjs/physics/RodinPhysics.js';
import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';

let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let originalScene = scene.scene;

scene.scene.background = new THREE.Color(0x808080);

/*
 var n = navigator.userAgent;
 if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)){ isMobile = true;  antialias = false; document.getElementById("MaxNumber").value = 200; }

 var materialType = 'MeshBasicMaterial';

 if(!isMobile){
 scene.add( new THREE.AmbientLight( 0x3D4143 ) );
 light = new THREE.DirectionalLight( 0xffffff , 1.4);
 light.position.set( 300, 1000, 500 );
 light.target.position.set( 0, 0, 0 );
 light.castShadow = true;
 light.shadowCameraNear = 500;
 light.shadowCameraFar = 1600;
 light.shadowCameraFov = 70;
 light.shadowBias = 0.0001;
 light.shadowDarkness = 0.7;
 //light.shadowCameraVisible = true;
 light.shadowMapWidth = light.shadowMapHeight = 1024;
 scene.add( light );

 materialType = 'MeshPhongMaterial';

 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = THREE.PCFShadowMap;//THREE.BasicShadowMap;
 }*/

scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

let light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 6, 0);
light.castShadow = true;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;
light.shadow.camera.right = 4;
light.shadow.camera.left = -4;
light.shadow.mapSize.set(4096, 4096);
scene.add(light);

// objects raycasting
let raycaster;

let controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, null, 2);
controllerL.standingMatrix = controls.getStandingMatrix();

let controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, null, 3);
controllerR.standingMatrix = controls.getStandingMatrix();

SceneManager.addController(controllerL);
SceneManager.addController(controllerR);

let loader = new THREE.OBJLoader();
loader.setPath('./object/');
loader.load('vr_controller_vive_1_5.obj', function (object) {

    let loader = new THREE.TextureLoader();
    loader.setPath('./img/');

    object.children[0].material.map = loader.load('onepointfive_texture.png');
    object.children[0].material.specularMap = loader.load('onepointfive_spec.png');

    controllerL.add(object.clone());
    controllerR.add(object.clone());
});

raycaster = new RODIN.Raycaster(scene);

/////////// physics ////////////////////
scene.physics = RodinPhysics.getInstance("oimo");

//Setting up world
scene.physics.setupWorldGeneralParameters(0, -2.82, 0, 8, true, 32); // todo check 32-8 difference

///////////////// creating floor ///////////////////////
let floorWidth = 10;
let floorHeight = 0.1;
let floorDepth = 10;

// todo distinguish ground from plane
let geometry = new THREE.PlaneGeometry(floorWidth, floorDepth);
//let geometry = new THREE.BoxGeometry(floorWidth, floorHeight, floorDepth);
let material = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 1.0,
    metalness: 0.0,
    opacity: 0.8,
    transparent: true,
    side: THREE.DoubleSide
});
let ground = new THREE.Mesh(geometry, material);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, 0, 8);
ground.receiveShadow = true;

scene.add(ground);
// add physic
let groundRigitBody = new RigidBody({
    mesh: ground,
    mass: 0,
    type: "plane",
    dynamic: false
});
groundRigitBody.name = "ground";

/// axis object XYZ ///
/*let geometryX = new THREE.BoxGeometry(2, 0.01, 0.01);
 let materialX = new THREE.MeshStandardMaterial({
 color: 0x110000,
 roughness: 1.0,
 metalness: 0.2
 });
 let x = new THREE.Mesh(geometryX, materialX);
 x.position.set(-6, 0, 0);
 x.receiveShadow = true;
 scene.add(x);

 let geometryY = new THREE.BoxGeometry(0.01, 2, 0.01);
 let materialY = new THREE.MeshStandardMaterial({
 color: 0x001100,
 roughness: 1.0,
 metalness: 0.2
 });
 let y = new THREE.Mesh(geometryY, materialY);
 y.position.set(-7, 1, 0);
 y.receiveShadow = true;
 scene.add(y);

 let geometryZ = new THREE.BoxGeometry(0.01, 0.01, 2);
 let materialZ = new THREE.MeshStandardMaterial({
 color: 0x000011,
 roughness: 1.0,
 metalness: 0.2
 });
 let z = new THREE.Mesh(geometryZ, materialZ);
 z.position.set(-7, 0, -1);
 z.receiveShadow = true;
 scene.add(z);*/

///////////////// creating object ///////////////////////
let mass = 0.2;

let group = new THREE.Group();
//todo shifted position
group.position.set(0, 3, 5);
group.rotation.x = Math.PI/4;
scene.add(group);

let geometries = [
    new THREE.BoxGeometry(0.2, 0.5, 0.2),
    //new THREE.SphereGeometry(0.2, 64),
    //new THREE.ConeGeometry(0.2, 0.2, 64),
    //new THREE.CylinderGeometry(0.1, 0.1, 0.1, 64),
    //new THREE.IcosahedronGeometry(0.2, 1),
    //new THREE.TorusGeometry(0.2, 0.08, 12, 12),
    //new THREE.TorusKnotGeometry(0.2, 0.05, 30, 16)
];
let startPhysics = false;
setTimeout(()=>{startPhysics = true}, 5000);

// add raycastable objects to scene
for (let i = 0; i < 1; i++) {
    let geometry = geometries[Math.floor(Math.random() * geometries.length)];
    let material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.0
    });

    let object = new THREE.Mesh(geometry, material);
    //object.position.x = (Math.random() - 0.5) * 3;
    //object.position.y = (Math.random() - 0.5) * 3;
    //object.position.z = (Math.random() - 0.5) * 3;
    object.position.set(0, 5, 0);
    //object.rotation.x = (Math.random() - 0.5) * 2 * Math.PI;
    //object.rotation.y = (Math.random() - 0.5) * 2 * Math.PI;
    //object.rotation.z = (Math.random() - 0.5) * 2 * Math.PI;
    object.scale.set(1, 1, 1);

    object.castShadow = true;
    object.receiveShadow = true;

    let obj = new THREEObject(object);
    obj.on('ready', () => {
        group.add(obj.object3D);
        RODIN.Raycastables.push(obj.object3D);
        obj.object3D.initialParent = obj.object3D.parent;

        // add physic
        let objectRigitBody = new RigidBody({
            mesh: obj.object3D,
            mass: mass,
            dynamic: true
        });
        objectRigitBody.name = obj.object3D.geometry.type;
    });

    // hover
    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt, controller) => {
        if (!obj.hoveringObjects) {
            obj.hoveringObjects = [];
        }
        if (obj.hoveringObjects.indexOf(controller) > -1) return;
        obj.object3D.material.emissive.r = 1;
        obj.hoveringObjects.push(controller);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (controller) => {
        if (obj.hoveringObjects.indexOf(controller) > -1) {
            obj.hoveringObjects.splice(obj.hoveringObjects.indexOf(controller));
        }
        if (obj.hoveringObjects.length !== 0 || obj.object3D.parent !== obj.object3D.initialParent) {
            return;
        }
        obj.object3D.material.emissive.r = 0;
    });

    // CONTROLLER_KEY
    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt, controller) => {
        obj.object3D.scale.set(1.1, 1.1, 1.1);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, (evt, controller) => {
        obj.object3D.scale.set(1, 1, 1);

    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK, (evt, controller) => {
        if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY1) {
        }
        if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) {
        }
    });

    // Controller touch
    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_START, (evt, controller) => {
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_END, (evt, controller) => {
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TAP, (evt, controller) => {
    });
}
/*
 controllerL.onKeyDown = controllerKeyDown;
 controllerL.onKeyUp = controllerKeyUp;

 controllerR.onKeyDown = controllerKeyDown;
 controllerR.onKeyUp = controllerKeyUp;

 function controllerKeyDown(keyCode) {
 if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
 this.engaged = true;
 if (!this.pickedItems) {
 this.pickedItems = [];
 }

 if (this.intersected && this.intersected.length > 0) {
 this.intersected.map(intersect => {
 if (intersect.object3D.parent != intersect.object3D.initialParent) {
 return;
 }

 changeParent(intersect.object3D, this.reycastingLine);
 //let targetParent = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.04, 12, 12));
 let targetParent = new THREE.Object3D();
 this.reycastingLine.add(targetParent);
 targetParent.position.copy(intersect.object3D.position);
 changeParent(intersect.object3D, targetParent);

 this.pickedItems.push(intersect.object3D);
 if (intersect.initialRotX) {
 intersect.initialRotX = 0;
 intersect.initialRotY = 0;
 }
 });
 }

 this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, null, keyCode, this);
 }

 function controllerKeyUp(keyCode) {
 if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
 this.engaged = false;
 if (this.pickedItems && this.pickedItems.length > 0) {
 this.pickedItems.map(item => {
 let targetParent = item.parent;
 changeParent(item, item.initialParent);
 this.reycastingLine.remove(targetParent);
 });
 this.pickedItems = [];
 }
 this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, null, keyCode, this);
 }

 controllerL.onTouchUp = controllerTouchUp;
 controllerL.onTouchDown = controllerTouchDown;

 controllerR.onTouchUp = controllerTouchUp;
 controllerR.onTouchDown = controllerTouchDown;

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
 this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_START, null, keyCode, this);
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
 this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_END, null, keyCode, this);
 }
 */
scene.preRender( () => {
    // Update scene's objects physics.
    //if(startPhysics)
    scene.physics.updateWorldPhysics(RODIN.Time.deltaTime());
});