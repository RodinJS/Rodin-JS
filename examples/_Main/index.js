import {WTF} from '../../_build/js/rodinjs/RODIN.js';

import {THREE} from '../../_build/js/three/THREE.GLOBAL.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';

console.log(RODIN);

import '../../node_modules/three/examples/js/controls/VRControls.js';
import '../../node_modules/three/examples/js/effects/VREffect.js';

WTF.is('Rodin.JS v0.0.1');



///////////////////////TWEEN EXAMPLE////////////////////////////////

var tween = new TWEEN.Tween({ x: 0, y: 0 })
    .to({ x: 100, y: 100 }, 1000)
    .onUpdate(function() {
        console.log(this.x, this.y);
    })
    .start();
var skybox = null;

// WTF.is(tween);
///////////////////////////////////////////////////////////////////



/////////////////////////////WebVR Example/////////////////////////////////////

// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);
controls.standing = true;

/*var controls = new RODIN.MobileCameraControls(
 scene,
 camera,
 new THREE.Vector3(0, 0, 0),
 new THREE.Vector3(0, 0, -0.01),
 renderer.domElement,
 true
 );
 controls.userHeight = 1.6*/


// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var distanceRatio = 1;


// Add a repeating grid as a skybox.
var boxSize = 15 * distanceRatio;
var loader = new THREE.TextureLoader();
loader.load('img/boxW.png', onTextureLoaded);

function onTextureLoaded(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(boxSize, boxSize);

    var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
//    color: 0x01BE00,
        side: THREE.BackSide
    });

    // Align the skybox to the floor (which is at y=0).
    skybox = new THREE.Mesh(geometry, material);

    scene.add(skybox);
    skybox.position.y = boxSize / 2 - controls.userHeight;
    // For high end VR devices like Vive and Oculus, take into account the stage
    // parameters provided.
    setupStage();
}


// Create a VR manager helper to enter and exit VR mode.
var params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);

// Create 3D objects.
var boxCount = 1000;
var particleBoxSize = 0.015 * distanceRatio;
var geometry = new THREE.BoxGeometry(particleBoxSize, particleBoxSize, particleBoxSize);
var material = new THREE.MeshNormalMaterial();
//var cube = new THREE.Mesh(geometry, material);
var cubes = [];
for (var i = 0; i < boxCount; i++) {
    cubes.push(new THREE.Mesh(geometry, material));
    cubes[i].position.set(1.5 * distanceRatio * (Math.random() - 0.5), controls.userHeight - 3 * distanceRatio * (Math.random() - 0.5), 1.5 * distanceRatio * (Math.random() - 0.5));
    scene.add(cubes[i]);
}

// Position cube mesh to be right in front of you.
//cube.position.set(0, controls.userHeight, -1);

// Add cube mesh to your three.js scene
//scene.add(cube);

// Kick off animation loop
requestAnimationFrame(animate);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

// Request animation frame loop function
var lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    // Apply rotation to cube mesh
//  cube.rotation.y += delta * 0.0006;
    for (var i = 0; i < boxCount; i++) {
        cubes[i].rotation.y += delta * 0.001;
    }

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

var display;

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
    navigator.getVRDisplays().then(function (displays) {
        // console.log(displays);
        if (displays.length > 0) {
            display = displays[0];
            // setInterval(function(){console.log("manager:",manager)}, 2000);
            if (display.stageParameters) {
                setStageDimensions(display.stageParameters);
            }
        }
    });
}

function setStageDimensions(stage) {
    // Make the skybox fit the stage.
    if (stage.sizeX === 0 || stage.sizeZ === 0) return;

    var material = skybox.material;
    scene.remove(skybox);

    // Size the skybox according to the size of the actual stage.
    var geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
    skybox = new THREE.Mesh(geometry, material);

    // Place it on the floor.
    skybox.position.y = boxSize / 2;
    scene.add(skybox);

    // Place the cube in the middle of the scene, at user height.
//  cube.position.set(0, controls.userHeight, 0);
}

////////////////////////////////////////////////////////////////////////////////////////////////