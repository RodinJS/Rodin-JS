import * as RODIN from '../../_build/js/rodinjs/RODIN.js';

console.log(RODIN);

import '../../node_modules/three/examples/js/controls/VRControls.js';
import '../../node_modules/three/examples/js/effects/VREffect.js';
import '../../node_modules/three/examples/js/WebVR.js';

RODIN.WTF.is('Rodin.JS v0.0.1');

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

scene.add(camera);

// scene.add(target)

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);
controls.standing = true;

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
var managerParams = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};

var manager = new WebVRManager(renderer, effect, managerParams);

var raycaster;

// controllers
var controller = new RODIN.MouseController();
controller.setRaycasterScene(scene);
controller.setRaycasterCamera(camera);

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


let params = {};
params.name ="name_";
params.width = 0.7;
params.height = 0.4;
params.background = {
    color: 0xffffff,
    opacity: 0.8,
    image: {
        url: "./img/test.jpg"
    }
};
params.border = {
    width: 0.01,
    color: 0x00ff00,
    radius: 0.02
};
params.label = {
    text: "Button 1",
    fontFamily: "Arial",
    fontSize: 0.1,
    color:0xffffff,
    opacity:1,
    position: {h: 30, v: 30}
};
params.image = {
    url: "./img/target.png",
    width: 0.2,
    height: 0.2,
    opacity: 0.5,
    position: {h: 0, v: 20}
};

let button = new RODIN.Button(params);
button.on('ready', (evt) => {
    let object = button.object3D;
    object.position.y = controls.userHeight;
    object.position.z = -1;

    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
});


/*    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, () => {
        obj.object3D.material.emissive.r = 1;
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
        obj.object3D.material.emissive.r = 0;
    });

    // CONTROLLER_KEY

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
        //console.log(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN + " Event, KeyCode " + evt.keyCode);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
        //console.log(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP + " Event, KeyCode " + evt.keyCode);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK, (evt) => {
        //console.log(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK + " Event, KeyCode " + evt.keyCode);
    });*/

controller.onKeyDown = controllerKeyDown;
controller.onKeyUp = controllerKeyUp;
controller.onControllerUpdate = controllerUpdate;


/*function controllerUpdate() {
    let mouse = this.getGamepad();
    this.raycaster.setFromCamera( {x:mouse.axes[0], y:mouse.axes[1]}, camera );

    if (this.pickedItems && this.pickedItems.length > 0) {
        this.pickedItems.map(item => {
            if ( this.raycaster.ray.intersectPlane( item.raycastCameraPlane, item.intersection ) ) {
                if(this.keyCode === 1){
                    item.position.copy( item.intersection.sub( item.offset ) );
                } else if(this.keyCode === 3){
                    let shift = item.intersection.sub( item.offset ).sub( item.position );
                    let initParent = item.parent;
                    changeParent(item, camera);
                    item.rotation.x = item.initRotation.x - 4*shift.y;
                    item.rotation.y = item.initRotation.y - 5*shift.x;
                    item.rotation.z = item.initRotation.z;
                    console.log(item.rotation );
                    changeParent(item, initParent);

                }
            }
        });
    }
}*/
function controllerUpdate() {
    let mouse = this.getGamepad();
    this.raycaster.setFromCamera( {x:mouse.axes[0], y:mouse.axes[1]}, camera );

    if (this.pickedItems && this.pickedItems.length > 0) {
        this.pickedItems.map(item => {
            if ( this.raycaster.ray.intersectPlane( item.raycastCameraPlane, item.intersection ) ) {
                if(this.keyCode === 1){
                    item.position.copy( item.intersection.sub( item.offset ) );
                } else if(this.keyCode === 3){
                    let shift = {x: mouse.axes[0] - item.initMousePos.x, y: mouse.axes[1] - item.initMousePos.y};
                    item.initMousePos = {x: mouse.axes[0], y: mouse.axes[1]};
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

function controllerKeyDown(keyCode) {

    console.log(keyCode);
    if (keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) return;
    this.keyCode = keyCode;
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }

    if (this.intersected && this.intersected.length > 0) {
        let mouse = this.getGamepad();
        mouse.stopPropagationOnMouseDown = true;
        mouse.stopPropagationOnMouseMove = true;

        this.intersected.map( intersect => {
            this.pickedItems.push(intersect.object3D);

            intersect.object3D.raycastCameraPlane = new THREE.Plane();
            intersect.object3D.offset = new THREE.Vector3();
            intersect.object3D.intersection = new THREE.Vector3();

            intersect.object3D.raycastCameraPlane.setFromNormalAndCoplanarPoint(
                camera.getWorldDirection(intersect.object3D.raycastCameraPlane.normal),
                intersect.object3D.position
            );

            if ( this.raycaster.ray.intersectPlane( intersect.object3D.raycastCameraPlane, intersect.object3D.intersection   ) ) {
                intersect.object3D.offset.copy( intersect.object3D.intersection ).sub( intersect.object3D.position );
                if(keyCode === 3){
                    let initParent = intersect.object3D.parent;
                    changeParent(intersect.object3D, camera);
                    intersect.object3D.initRotation = intersect.object3D.rotation.clone();
                    intersect.object3D.initMousePos = {x: mouse.axes[0], y: mouse.axes[1]};
                    changeParent(intersect.object3D, initParent);
                }
            }
        });


    }

    this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, null, keyCode, this);
}

function controllerKeyUp(keyCode) {
    if (keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) return;
    this.keyCode = null;
    this.engaged = false;
    this.getGamepad().stopPropagationOnMouseDown = false;
    this.getGamepad().stopPropagationOnMouseMove = false;
    this.pickedItems = [];
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
    if(button.object3D)button.object3D.rotation.y +=0.01;

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
