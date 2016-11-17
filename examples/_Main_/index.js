import {WTF} from '../../_build/js/rodinjs/RODIN.js';

import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';

console.log(RODIN);

import '../../_build/js/vendor/three/examples/js/controls/VRControls.js';
import '../../_build/js/vendor/three/examples/js/effects/VREffect.js';

WTF.is('Rodin.JS v0.0.1');



///////////////////////TWEEN EXAMPLE////////////////////////////////
let skybox = null;

// WTF.is(tween);
///////////////////////////////////////////////////////////////////



/////////////////////////////WebVR Example/////////////////////////////////////

// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
let scene = new THREE.Scene();

// Create a three.js camera.
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

// Apply VR headset positional data to camera.
let controls = new THREE.VRControls(camera);
controls.standing = true;


// Apply VR stereo rendering to renderer.
let effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

let distanceRatio = 1;


// Add a repeating grid as a skybox.
let boxSize = 15 * distanceRatio;
let loader = new THREE.TextureLoader();
loader.load('img/boxW.png', onTextureLoaded);

function onTextureLoaded(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(boxSize, boxSize);

    let geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    let material = new THREE.MeshBasicMaterial({
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
let params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};
let manager = new WebVRManager(renderer, effect, params);

// Create 3D objects.
let boxCount = 1000;
let particleBoxSize = 0.015 * distanceRatio;
let geometry = new THREE.BoxGeometry(particleBoxSize, particleBoxSize, particleBoxSize);
let material = new THREE.MeshNormalMaterial();
//let cube = new THREE.Mesh(geometry, material);
let cubes = [];
for (let i = 0; i < boxCount; i++) {
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
let lastRender = 0;
function animate(timestamp) {
    let delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    // Apply rotation to cube mesh
//  cube.rotation.y += delta * 0.0006;
    for (let i = 0; i < boxCount; i++) {
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

let display;

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

    let material = skybox.material;
    scene.remove(skybox);

    // Size the skybox according to the size of the actual stage.
    let geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
    skybox = new THREE.Mesh(geometry, material);

    // Place it on the floor.
    skybox.position.y = boxSize / 2;
    scene.add(skybox);

    // Place the cube in the middle of the scene, at user height.
//  cube.position.set(0, controls.userHeight, 0);
}

////////////////////////////////////////////////////////////////////////////////////////////////