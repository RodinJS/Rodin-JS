import {WTF} from '../../_build/js/rodinjs/RODIN.js';
import {THREE} from '../../_build/js/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';

import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';

console.log(RODIN);

import '../../_build/js/cannon/cannon.js';

import '../../node_modules/three/examples/js/controls/VRControls.js';
import '../../node_modules/three/examples/js/effects/VREffect.js';
import '../../node_modules/three/examples/js/loaders/OBJLoader.js';
import '../../node_modules/three/examples/js/WebVR.js';

WTF.is('Rodin.JS v0.0.1');

// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.gammaInput = true;
renderer.gammaOutput = true;

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

// Create a three.js camera.
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

// Apply VR headset positional data to camera.
let controls = new THREE.VRControls(camera);
controls.standing = true;

// Apply VR stereo rendering to renderer.
let effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
let params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};

let manager = new WebVRManager(renderer, effect, params);

scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

let light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 6, 0);
light.castShadow = true;
light.shadow.camera.top = 4;
light.shadow.camera.bottom = -4;
light.shadow.camera.right = 4;
light.shadow.camera.left = -4;
light.shadow.mapSize.set(4096, 4096);
scene.add(light);

// objects raycasting
let raycaster;

let controllerL = new RODIN.ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, null, 2);
controllerL.standingMatrix = controls.getStandingMatrix();

let controllerR = new RODIN.ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, null, 3);
controllerR.standingMatrix = controls.getStandingMatrix();

scene.add(controllerL);
scene.add(controllerR);

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
scene.physics = RODIN.RodinPhysics.getInstance();

//Setting up world
scene.physics.setupWorldGeneralParameters(0, -9.82, 0, 10, true, 32); // todo check 32-8 difference

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
    //side: THREE.DoubleSide
});
let ground = new THREE.Mesh(geometry, material);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, -0.05, 8);
ground.receiveShadow = true;

scene.add(ground);
// add physic
let groundRigitBody = new RODIN.RigidBody(ground, 0);

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
group.position.set(0, 0, 2);
//group.rotation.y = 0.4;
scene.add(group);

let geometries = [
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.SphereGeometry(0.2, 64),
    new THREE.ConeGeometry(0.2, 0.2, 64),
    new THREE.CylinderGeometry(0.1, 0.1, 0.1, 64),
    //new THREE.IcosahedronGeometry(0.2, 1),
    //new THREE.TorusGeometry(0.2, 0.08, 12, 12),
    //new THREE.TorusKnotGeometry(0.2, 0.05, 30, 16)
];

// add raycastable objects to scene
for (let i = 0; i < 20; i++) {
    let geometry = geometries[Math.floor(Math.random() * geometries.length)];
    let material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.0
    });

    let object = new THREE.Mesh(geometry, material);
    object.position.x = (Math.random() - 0.5) * 3;
    object.position.y = (Math.random() - 0.5) * 3 + 2;
    object.position.z = (Math.random() - 0.5) * 3;
    object.rotation.x = (Math.random() - 0.5) * 2 * Math.PI;
    object.rotation.y = (Math.random() - 0.5) * 2 * Math.PI;
    object.rotation.z = (Math.random() - 0.5) * 2 * Math.PI;
    object.scale.set(1, 1, 1);

    object.castShadow = true;
    object.receiveShadow = true;

    let obj = new RODIN.THREEObject(object);
    obj.on('ready', () => {
        group.add(obj.object3D);
        RODIN.Raycastables.push(obj.object3D);
        obj.object3D.initialParent = obj.object3D.parent;

        // add physic
        let objectRigitBody = new RODIN.RigidBody(obj.object3D, mass);
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

// Kick off animation loop
requestAnimationFrame(animate);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

// Request animation frame loop function
function animate(timestamp) {

    // Update controller.
    controllerL.update();
    controllerR.update();

    // Update VR headset position and apply to camera.
    controls.update();

    // Render the scene through the manager.
    manager.render(scene, camera, timestamp);

    // Update scene's objects physics.
    scene.physics.updateWorldPhysics(timestamp);

    requestAnimationFrame(animate);
}

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

////////////////////////////////////////////////////////////////////////////////////////////////