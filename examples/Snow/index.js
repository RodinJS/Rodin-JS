import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {WTF} from '../../_build/js/rodinjs/RODIN.js';
import {timeout} from '../../_build/js/rodinjs/utils/timeout.js';
import {Interval} from '../../_build/js/rodinjs/utils/interval.js';

WTF.is(RODIN);

import '../../_build/js/rodinjs/utils/Math.js';
import '../../_build/js/vendor/three/examples/js/controls/VRControls.js';
import '../../_build/js/vendor/three/examples/js/effects/VREffect.js';

WTF.is('Rodin.JS v0.0.1');

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 20);

let controls = new THREE.VRControls(camera);
controls.standing = true;

/*var controls = new RODIN.MobileCameraControls(
 scene,
 camera,
 new THREE.Vector3(0, 0, 0),
 new THREE.Vector3(0, 0, -0.01),
 renderer.domElement,
 true
 );
 //controls.standing = true;
 controls.userHeight = 1.6;
 controls.object.position.y = controls.userHeight;*/

let effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

let skybox;
let boxSize = 15;
let snowObject = new THREE.Object3D();
let loader = new THREE.TextureLoader();
loader.load('img/box.png', onTextureLoaded);

function onTextureLoaded(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(boxSize, boxSize);
    let geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, boxSize, boxSize, boxSize);

    let material = new THREE.MeshBasicMaterial({
        color: 0x003300,
        wireframe: true
    });

    skybox = new THREE.Mesh(geometry, material);

    scene.add(skybox);
    skybox.position.y = boxSize / 2 - controls.userHeight;
    setupStage();

    let snow = new RODIN.Snow(0,
        'img/particle_snow2.png',
        boxSize,
        0.02,
        3,
        0.2,
        1
    );
    snow.on("ready", (evt) => {
        evt.target.object3D.position.y = boxSize / 2;
        snowObject.add(evt.target.object3D);
        scene.add(snowObject);
    });

/*
    console.log("gravity = " + snow.getGravity());
    console.log("wind  = " + snow.getWindSpeed());
    timeout(() => {
        snow.setGravity(2);
        snow.setWindSpeed(1);
        console.log("gravity = " + snow.getGravity());
        console.log("wind  = " + snow.getWindSpeed());
    }, 3000);
*/

/*
    timeout(() => {
        snow.setGravity(20);
        snow.setWindSpeed(10);
        console.log("gravity = " + snow.getGravity());
        console.log("wind  = " + snow.getWindSpeed());
    }, 8000);
*/

    var sloMoSno = new Interval(() => {
        snow.changeSpeed(0.05, 0.05);
        timeout(() => {
            snow.changeSpeed(1, 1);
        }, 3000);
    }, 8000, true);

}


let params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};
let manager = new WebVRManager(renderer, effect, params);


let light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(1, 1, 1);
scene.add(light1);

let light2 = new THREE.DirectionalLight(0x002288);
light2.position.set(-1, -1, -1);
scene.add(light2);

let amlight = new THREE.AmbientLight(0x222222);
scene.add(amlight);


requestAnimationFrame(animate);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

let lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;
    controls.update();
    manager.render(scene, camera, timestamp);
    RODIN.Objects.map(obj => obj.emit('update', new RODIN.Event(obj)));
    requestAnimationFrame(animate);
}

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

let display;

function setupStage() {
    navigator.getVRDisplays().then(function (displays) {
        if (displays.length > 0) {
            display = displays[0];
            if (display.stageParameters) {
                setStageDimensions(display.stageParameters);
            }
        }
    });
}

function setStageDimensions(stage) {
    if (stage.sizeX === 0 || stage.sizeZ === 0) return;

    let material = skybox.material;
    scene.remove(skybox);

    let geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
    skybox = new THREE.Mesh(geometry, material);

    skybox.position.y = boxSize / 2;
    scene.add(skybox);
}