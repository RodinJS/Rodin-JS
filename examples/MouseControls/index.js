import {THREE} from '../../_build/js/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {WTF} from '../../_build/js/rodinjs/RODIN.js';

import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';

console.log(RODIN);

import '../../node_modules/three/examples/js/controls/VRControls.js';
import '../../node_modules/three/examples/js/effects/VREffect.js';
import '../../node_modules/three/examples/js/loaders/OBJLoader.js';
import '../../node_modules/three/examples/js/WebVR.js';

WTF.is('Rodin.JS v0.0.1');

/////////////////////////////WebVR Example/////////////////////////////////////

// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.gammaInput = true;
renderer.gammaOutput = true;

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x808080 );

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000 );

/*var targetMap = new THREE.TextureLoader().load("./img/target.png");
var targetMaterial = new THREE.SpriteMaterial({map: targetMap, color: 0xffffff, opacity: 1, depthTest: false});
var target = new THREE.Sprite(targetMaterial);
// var target = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide}));
target.scale.set(0.01, 0.01, 0.01);
target.position.set(0, 0, -1);
camera.add(target);*/
scene.add(camera);

// scene.add(target)

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);
controls.standing = true;

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
var params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};

var manager = new WebVRManager(renderer, effect, params);

var raycaster;

// controllers
var controller = new RODIN.MouseController();
controller.setRaycasterScene(scene);
controller.setRaycasterCamera(camera);
// scene.add( controller1 );

raycaster = new RODIN.Raycaster( scene );

var geometry = new THREE.PlaneGeometry( 4, 4 );
var material = new THREE.MeshStandardMaterial( {
    color: 0xeeeeee,
    roughness: 1.0,
    metalness: 0.0
} );
var floor = new THREE.Mesh( geometry, material );
floor.rotation.x = - Math.PI / 2;
floor.receiveShadow = true;
scene.add( floor );

scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );

var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 6, 0 );
light.castShadow = true;
light.shadow.camera.top = 2;
light.shadow.camera.bottom = -2;
light.shadow.camera.right = 2;
light.shadow.camera.left = -2;
light.shadow.mapSize.set( 4096, 4096 );
scene.add( light );

// add raycastable objects to scene

var group = new THREE.Group();
scene.add( group );

var geometries = [
    new THREE.BoxGeometry( 0.2, 0.2, 0.2 ),
    new THREE.ConeGeometry( 0.2, 0.2, 64 ),
    new THREE.CylinderGeometry( 0.2, 0.2, 0.2, 64 ),
    new THREE.IcosahedronGeometry( 0.2, 3 ),
    new THREE.TorusGeometry( 0.2, 0.04, 64, 32 )
];

for ( var i = 0; i < 50; i ++ ) {

    var geometry = geometries[ Math.floor( Math.random() * geometries.length ) ];
    var material = new THREE.MeshStandardMaterial( {
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.0
    } );

    var object = new THREE.Mesh( geometry, material );

    object.position.x = Math.random() * 4 - 2;
    object.position.y = Math.random() * 2;
    object.position.z = Math.random() * 4 - 2;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.setScalar( Math.random() + 0.5 );

    object.castShadow = true;
    object.receiveShadow = true;

    // group.add( object );

    let obj = new RODIN.THREEObject(object);

    obj.on('ready', () => {
        group.add(obj.object3D);
        obj.object3D.initialParent = obj.object3D.parent;
        RODIN.Raycastables.push(obj.object3D);
    });

    // hover

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, () => {
        obj.object3D.material.emissive.r = 1;
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
        obj.object3D.material.emissive.r = 0;
    });

    // CONTROLLER_KEY

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
        console.log(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN + " Event, KeyCode " + evt.keyCode);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
        console.log(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP + " Event, KeyCode " + evt.keyCode);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK, (evt) => {
        console.log(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK + " Event, KeyCode " + evt.keyCode);
    });
}

controller.onKeyDown = controllerKeyDown;
controller.onKeyUp = controllerKeyUp;

function controllerKeyDown(keyCode) {
    console.log(controls);
    //if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }

    if (this.intersected && this.intersected.length > 0) {
        this.intersected.map(intersect => {
            console.log(intersect.object3D.parent,intersect)
            if (intersect.object3D.parent != intersect.object3D.initialParent) {
                return;
            }

            changeParent(intersect.object3D, camera);
            //let targetParent = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.04, 12, 12));
            let targetParent = new THREE.Object3D();
            camera.add(targetParent);
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
    console.log("up",keyCode);
    //if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
    this.engaged = false;
    if (this.pickedItems && this.pickedItems.length > 0) {
        this.pickedItems.map(item => {
            let targetParent = item.parent;
            changeParent(item, item.initialParent);
            camera.remove(targetParent);
        });
        this.pickedItems = [];
    }
    this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, null, keyCode, this);
}

// Kick off animation loop
requestAnimationFrame(animate);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

// Request animation frame loop function
function animate(timestamp) {

    // Update controller.
    controller.update();

    // Update VR headset position and apply to camera.
    controls.update();

    // Render the scene through the manager.
    manager.render(scene, camera, timestamp);

    requestAnimationFrame(animate);
}

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

////////////////////////////////////////////////////////////////////////////////////////////////
