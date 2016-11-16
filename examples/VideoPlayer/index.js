import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {WTF} from '../../_build/js/rodinjs/RODIN.js';
import {timeout} from '../../_build/js/rodinjs/utils/timeout.js';
import {Interval} from '../../_build/js/rodinjs/utils/interval.js';
import {MaterialPlayer} from '../../_build/js/rodinjs/video/MaterialPlayer.js';

WTF.is(RODIN);

import '../../_build/js/rodinjs/utils/Math.js';
import '../../node_modules/three/examples/js/controls/VRControls.js';
import '../../node_modules/three/examples/js/effects/VREffect.js';

WTF.is('Rodin.JS v0.0.1');

let renderer = new THREE.WebGLRenderer({antialias: window.devicePixelRatio < 2});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = false;

document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.01, 150);

let controls = new THREE.VRControls(camera);
controls.standing = true;

let effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

let player = new MaterialPlayer("video/test1.mp4");
let material = new THREE.MeshBasicMaterial({
    map: player.getTextureL()
});


let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(30, 720, 4), material);
sphere.scale.set(1,1,-1);
scene.add(sphere);


renderer.domElement.addEventListener("click", () => {
    player.playPause();
});

let params = {
    hideButton: false, // Default: false.
    predistorted: false // Default: false.
};

let manager = new WebVRManager(renderer, effect, params);

requestAnimationFrame(animate);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

let lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;
    controls.update();
    manager.render(scene, camera, timestamp);
    player.update(delta);
    RODIN.Objects.map(obj => obj.emit('update', new RODIN.Event(obj)));
    requestAnimationFrame(animate);
}

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}