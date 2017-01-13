import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {ViveController} from '../../_build/js/rodinjs/controllers/ViveController.js';
import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';


let scene = SceneManager.get();
scene.scene.background = new THREE.Color(0xb5b5b5);
scene.setCameraProperty("far", 10000);

let controls = scene.controls;

let renderer = scene.renderer;
renderer.setPixelRatio(window.devicePixelRatio);


let controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, scene.camera, 2);
controllerL.standingMatrix = controls.getStandingMatrix();
controllerL.initControllerModel();

controllerL.onKeyDown = controllerKeyDown;
controllerL.onKeyUp = controllerKeyUp;
controllerL.onTouchUp = controllerTouchUp;
controllerL.onTouchDown = controllerTouchDown;

SceneManager.addController(controllerL);
scene.add(controllerL);

let controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, scene.camera, 3);
controllerR.standingMatrix = controls.getStandingMatrix();

controllerR.onKeyDown = controllerKeyDown;
controllerR.onKeyUp = controllerKeyUp;
controllerR.onTouchUp = controllerTouchUp;
controllerR.onTouchDown = controllerTouchDown;

SceneManager.addController(controllerR);
scene.add(controllerR);

// let loader = new THREE.OBJLoader();
// loader.setPath('./object/');
// loader.load('vr_controller_vive_1_5.obj', function (object) {
//
//     let loader = new THREE.TextureLoader();
//     loader.setPath('./img/');
//
//     object.children[0].material.map = loader.load('onepointfive_texture.png');
//     object.children[0].material.specularMap = loader.load('onepointfive_spec.png');
//
//     controllerL.add(object.clone());
//     controllerR.add(object.clone());
// });

let geometry = new THREE.PlaneGeometry(4, 4);
let material = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 1.0,
    metalness: 0.0
});
let floor = new THREE.Mesh(geometry, material);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

let light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 6, 0);
light.castShadow = true;
light.shadow.camera.top = 2;
light.shadow.camera.bottom = -2;
light.shadow.camera.right = 2;
light.shadow.camera.left = -2;
light.shadow.mapSize.set(4096, 4096);
scene.add(light);

// add raycastable objects to scene
let group = new THREE.Group();
group.position.set(1, 1, 0);
group.rotation.y = 0.4;
scene.add(group);

let geometries = [
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.ConeGeometry(0.2, 0.2, 64),
    new THREE.CylinderGeometry(0.1, 0.1, 0.1, 64),
    new THREE.IcosahedronGeometry(0.2, 1),
    new THREE.TorusGeometry(0.2, 0.08, 12, 12)
];

for (let i = 0; i < 12; i++) {

    let geometry = geometries[Math.floor(Math.random() * geometries.length)];
    let material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.0
    });

    let object = new THREE.Mesh(geometry, material);

    object.position.x = (Math.random() - 0.5) * 2;
    object.position.y = (Math.random() - 0.5) * 2;
    object.position.z = (Math.random() - 0.5) * 2;

    object.rotation.x = (Math.random() - 0.5) * 2 * Math.PI;
    object.rotation.y = (Math.random() - 0.5) * 2 * Math.PI;
    object.rotation.z = (Math.random() - 0.5) * 2 * Math.PI;

    object.scale.set(1, 1, 1);

    object.castShadow = true;
    object.receiveShadow = true;

    let obj = new RODIN.THREEObject(object);

    obj.on('ready', () => {
        group.add(obj.object3D);
        obj.object3D.initialParent = obj.object3D.parent;
        RODIN.Raycastables.push(obj.object3D);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
        if (!obj.hoveringObjects) {
            obj.hoveringObjects = [];
        }
        if (obj.hoveringObjects.indexOf(evt.controller) > -1) return;
        obj.object3D.material.emissive.r = 1;
        obj.hoveringObjects.push(evt.controller);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
        if (obj.hoveringObjects.indexOf(evt.controller) > -1) {
            obj.hoveringObjects.splice(obj.hoveringObjects.indexOf(evt.controller));
        }
        if (obj.hoveringObjects.length !== 0 || obj.object3D.parent !== obj.object3D.initialParent) {
            return;
        }
        obj.object3D.material.emissive.r = 0;
    });

    // CONTROLLER_KEY
    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
        obj.object3D.scale.set(1.1, 1.1, 1.1);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
        obj.object3D.scale.set(1, 1, 1);

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
}

function controllerKeyDown(keyCode) {
    if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }

    if (this.intersected && this.intersected.length > 0) {
        this.intersected.map(intersect => {
            console.log(intersect);
            if (intersect.object.parent != intersect.object.initialParent) {
                return;
            }

            changeParent(intersect.object, this.reycastingLine);
            let targetParent = new THREE.Object3D();
            this.reycastingLine.add(targetParent);
            targetParent.position.copy(intersect.object.position);
            changeParent(intersect.object, targetParent);

            this.pickedItems.push(intersect.object);
            if (intersect.initialRotX) {
                intersect.initialRotX = 0;
                intersect.initialRotY = 0;
            }
        });
    }
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

                intersect.initialRotX = +intersect.object.parent.rotation.x;
                intersect.initialRotY = +intersect.object.parent.rotation.y;
            }
            let x = (intersect.initialRotX + ((-gamepad.axes[1]) - gamepad.initialTouchX));
            let y = (intersect.initialRotY + ((-gamepad.axes[0]) - gamepad.initialTouchY));

            let directionY = new THREE.Vector3(0, 1, 0).normalize();
            let quaternionY = new THREE.Quaternion();
            quaternionY.setFromAxisAngle(directionY, -y);

            let directionX = new THREE.Vector3(1, 0, 0).normalize();
            let quaternionX = new THREE.Quaternion();
            quaternionX.setFromAxisAngle(directionX, x);

            intersect.object.parent.updateMatrixWorld();
            intersect.object.parent.quaternion.copy(new THREE.Quaternion().multiplyQuaternions(quaternionX, quaternionY));
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

            let holderObj = intersect.object.parent;
            changeParent(intersect.object, intersect.object.initialParent);
            holderObj.rotation.set(0, 0, 0);
            changeParent(intersect.object, holderObj);
        });
    }
}