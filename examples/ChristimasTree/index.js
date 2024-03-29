import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {Snow} from '../../_build/js/rodinjs/sculpt/Snow.js';
import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {ViveController} from '../../_build/js/rodinjs/controllers/ViveController.js';
import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';

let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let threeScene = scene.scene;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = false;

scene.setCameraProperty("far", 200);

threeScene.fog = new THREE.Fog(0x7a8695, 0, 23);

/// mouse controller

let mouseController = new MouseController();
mouseController.onControllerUpdate = mouseControllerUpdate;
SceneManager.addController(mouseController);

/// vive controllers

let controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, threeScene, camera, 2);
controllerL.standingMatrix = controls.getStandingMatrix();

controllerL.onKeyDown = controllerKeyDown;
controllerL.onKeyUp = controllerKeyUp;
controllerL.onTouchUp = controllerTouchUp;
controllerL.onTouchDown = controllerTouchDown;

SceneManager.addController(controllerL);
scene.add(controllerL);

let controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, threeScene, camera, 2);
controllerR.standingMatrix = controls.getStandingMatrix();

controllerR.onKeyDown = controllerKeyDown;
controllerR.onKeyUp = controllerKeyUp;
controllerR.onTouchUp = controllerTouchUp;
controllerR.onTouchDown = controllerTouchDown;

SceneManager.addController(controllerR);
scene.add(controllerR);

let loader = new THREE.OBJLoader();
loader.setPath('./models/');
loader.load('vr_controller_vive_1_5.obj', function (object) {
    let loader = new THREE.TextureLoader();
    loader.setPath('./img/');

    object.children[0].material.map = loader.load('onepointfive_texture.png');
    object.children[0].material.specularMap = loader.load('onepointfive_spec.png');

    controllerL.add(object.clone());
    controllerR.add(object.clone());
});

/// Add light
let light1 = new THREE.DirectionalLight(0xbbbbbb);
light1.position.set(0, 6, 1);
light1.castShadow = true;
light1.shadow.camera.top = 15;
light1.shadow.camera.bottom = -15;
light1.shadow.camera.right = 15;
light1.shadow.camera.left = -15;
light1.shadow.mapSize.set(2048, 2048);
scene.add(light1);
scene.add(new THREE.AmbientLight(0xaaaaaa));

// Add a skybox.
let boxSize = 30;

let skybox = new THREE.Mesh(new THREE.BoxGeometry(boxSize * 2, boxSize * 2, boxSize * 2), new THREE.MeshBasicMaterial({color: 0x000000}));
skybox.position.y = controls.userHeight;
skybox.scale.set(1, 1, -1);
scene.add(skybox);

// Add a snowContainer.
let snowBoxSize = 18;
boxSize = 21;

let snowContainer = new THREE.Object3D();
snowContainer.rotation.y = -Math.PI / 2;
snowContainer.position.y = -boxSize / 2 + snowBoxSize / 2;
scene.add(snowContainer);

/// Add snow
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
});


/// Add terrain
let terrain = ModelLoader.load("./models/terrain.json");
terrain.on('ready', () => {
    let textureSnow = new THREE.TextureLoader().load("./models/snow_texture.jpg");
    textureSnow.wrapS = THREE.RepeatWrapping;
    textureSnow.wrapT = THREE.RepeatWrapping;
    textureSnow.repeat.x = 15;
    textureSnow.repeat.y = 15;

    let mesh = new THREE.Mesh(terrain.object3D.children[0].geometry,
        new THREE.MeshLambertMaterial({
            color: 0xbbbbbb,
            map: textureSnow,
            clipShadows: true
        }));

    mesh.scale.set(0.3, 0.4, 0.3);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
});

// christmasTree
let s = 0.05;
let christmasTree =  ModelLoader.load('./models/christmasTree.json');
christmasTree.on('ready', () => {
    christmasTree.object3D.children[0].material.materials[0].alphaTest = 0.35;
    christmasTree.object3D.children[0].material.materials[0].transparent = false;
    christmasTree.object3D.children[0].material.materials[0].side = THREE.DoubleSide;
    christmasTree.object3D.children[0].material.materials[0].clipShadows = true;

    christmasTree.object3D.scale.set(s, s, s);
    christmasTree.object3D.position.x = 0.5;
    christmasTree.object3D.position.y = 0;
    christmasTree.object3D.position.z = 0.5;

    christmasTree.object3D.castShadow = true;
    christmasTree.object3D.receiveShadow = true;
    scene.add(christmasTree.object3D);
});

// random tree
let tree =  ModelLoader.load('./models/tree.json');
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
});

// christmasTree toys
let toyURLS = [
    './models/bell.json',
    './models/candy.json',
    './models/toyDuploCone.json',
    './models/toySphereBig.json',
    './models/toySphereMiddle.json',
    './models/toySphereSmall.json',
    './models/star.json',
];
let toyReady = function () {

    let obj;
    if(this.object3D instanceof THREE.Group){
        obj = new RODIN.THREEObject(this.object3D.children[0]);
        console.log(obj);
    }else{
        obj = new RODIN.THREEObject(this.object3D);
    }
    let k = Math.randomFloatIn(-0.1, -1.0);
    let alpha = Math.randomFloatIn(-Math.PI, Math.PI);

    obj.object3D.position.x = (Math.sin(alpha) + s) * k;
    obj.object3D.position.y = s;
    obj.object3D.position.z = (Math.cos(alpha) + s) * k;
    obj.object3D.rotation.y = (Math.random() - 0.5) * 2 * Math.PI / 2;
    obj.object3D.scale.set(s, s, s);

    obj.object3D.castShadow = true;
    obj.object3D.receiveShadow = true;


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
            changeParent(target.object3D, controller.raycastingLine.object3D);
            //let targetParent = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.04, 12, 12));
            let targetParent = new THREE.Object3D();
            controller.raycastingLine.object3D.add(targetParent);
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
            controller.raycastingLine.object3D.remove(targetParent);
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
    let toy = ModelLoader.load(url);

    toy.on('ready', toyReady);
    toy.on('ready', () => {
            toy.object3D.children[0].geometry.computeVertexNormals();

            toy.object3D.children[0].material.materials[0].reflectivity = 1;
            toy.object3D.children[0].material.materials[0].hue = 1;
            if (url !== toyURLS[1]) {
                toy.object3D.children[0].material.materials[0].color = new THREE.Color(colors[Math.randomIntIn(0, colors.length - 1)]);
            }

            scene.add(toy.object3D.children[0]);
        }
    )
}

let toy = ModelLoader.load(toyURLS[6]);
toy.on('ready', toyReady);
toy.on('ready', () => {
    toy.object3D.children[0].geometry.center();
    let toyGeo = toy.object3D.children[0].geometry.clone();
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

    scene.add(toy.object3D.children[0]);
});

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
}

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
                    let deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
                            new THREE.Euler(-shift.y * Math.PI, shift.x * Math.PI, 0, 'XYZ')
                        );

                    item.quaternion.multiplyQuaternions(deltaRotationQuaternion, item.quaternion);

                    changeParent(item, initParent);
                }
            }
        });
    }
}