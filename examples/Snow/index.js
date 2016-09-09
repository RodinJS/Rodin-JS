import {THREE} from '../../_build/js/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {WTF} from '../../_build/js/rodinjs/RODIN.js';
import {timeout} from '../../_build/js/rodinjs/utils/timeout.js';
import {Interval} from '../../_build/js/rodinjs/utils/interval.js';

WTF.is(RODIN);

import '../../_build/js/rodinjs/utils/Math.js';
import '../../node_modules/three/examples/js/controls/VRControls.js';
import '../../node_modules/three/examples/js/effects/VREffect.js';

WTF.is('Rodin.JS v0.0.1');

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 10000);

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
//controls.standing = true;
controls.userHeight = 1.6;
controls.object.position.y = controls.userHeight;*/

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var skybox;
var boxSize = 15 ;
var snowObject = new THREE.Object3D();
var loader = new THREE.TextureLoader();
loader.load('img/box.png', onTextureLoaded);

function onTextureLoaded(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(boxSize, boxSize);
    var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, boxSize, boxSize, boxSize);
/*    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });*/
    var material = new THREE.MeshBasicMaterial({
        color: 0x003300,
        wireframe: true
    });

    skybox = new THREE.Mesh(geometry, material);

    scene.add(skybox);
    skybox.position.y = boxSize / 2 - controls.userHeight;
    setupStage();
    ///////
    //setStageDimensions({sizeX:4, sizeZ:3});
    //console.log(Math.min(skybox.geometry.parameters.width,skybox.geometry.parameters.height, skybox.geometry.parameters.depth ))
    //////
    var snow = new RODIN.Snow(0,
        'img/particle_snow2.png',
        Math.min(skybox.geometry.parameters.width,skybox.geometry.parameters.height, skybox.geometry.parameters.depth ),
        0.02,
        3000
    );
    snow.on("ready", (evt) => {
        snow.object3D.position.y = (snow.areaSize/2);
        snowObject.add(snow.object3D);
        //snowObject.position.z = -3;
        scene.add(snowObject);
    });

    var sloMoSno = new Interval(() => {
        snow.changeSpeed(0.05, 0.05);
        timeout(() => {
            snow.changeSpeed(1, 1);
        }, 3000);
    }, 8000, true);

}





var params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);


var light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(1, 1, 1);
scene.add(light1);

var light2 = new THREE.DirectionalLight(0x002288);
light2.position.set(-1, -1, -1);
scene.add(light2);

var amlight = new THREE.AmbientLight(0x222222);
scene.add(amlight);


requestAnimationFrame(animate);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

var lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;
    //snowObject.rotation.y += 0.01;
    controls.update();
    manager.render(scene, camera, timestamp);
    RODIN.Objects.map( obj => obj.emit('update', new RODIN.Event(obj)));
    requestAnimationFrame(animate);
}

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

var display;

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

    var material = skybox.material;
    scene.remove(skybox);

    var geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
    skybox = new THREE.Mesh(geometry, material);

    skybox.position.y = boxSize / 2;
    scene.add(skybox);
}