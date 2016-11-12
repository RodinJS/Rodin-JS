import {THREE} from '../../_build/js/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {WTF} from '../../_build/js/rodinjs/RODIN.js';
import '../../_build/js/rodinjs/vendor/JDLoader.min.js';

WTF.is(RODIN);

import '../../node_modules/three/examples/js/controls/VRControls.js';
import '../../node_modules/three/examples/js/effects/VREffect.js';

WTF.is('Rodin.JS v0.0.1');

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

let time = RODIN.Time.getInstance();
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);

let skybox;

let controls = new THREE.VRControls(camera);
controls.standing = true;

let effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

let distanceRatio = 1;

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
        side: THREE.BackSide
    });

    skybox = new THREE.Mesh(geometry, material);
    scene.add(skybox);
    skybox.position.y = boxSize / 2 - controls.userHeight;
    setupStage();
}

let params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};
let manager = new WebVRManager(renderer, effect, params);

let light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(1, 1, 1);
scene.add(light1);

let light2 = new THREE.DirectionalLight(0xcccccc);
light2.position.set(-1, -1, -1);
scene.add(light2);

let amlight = new THREE.AmbientLight(0x3e3e3e);
scene.add(amlight);

let obj = new RODIN.JDModelObject(0, './model/man.jd');

obj.on('ready', () => {
    let s = 0.009;
    obj.object3D.scale.set(s, s, s);
    obj.object3D.position.y = controls.userHeight - 1.6;
    obj.object3D.position.z = - 1.6;
    obj.object3D.rotation.z = Math.PI / 2;
    obj.object3D.rotation.y = Math.PI / 2;
    scene.add(obj.object3D);
});

obj.on('update', () => {
    obj.object3D && (obj.object3D.rotation.y += time.deltaTime()/2000);
});

requestAnimationFrame(animate);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

function animate(timestamp) {
    time.tick();
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