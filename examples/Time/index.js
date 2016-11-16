import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {WTF} from '../../_build/js/rodinjs/RODIN.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';

WTF.is(RODIN);

import '../../node_modules/three/examples/js/controls/VRControls.js';
import '../../node_modules/three/examples/js/effects/VREffect.js';
import * as GUI from '../../node_modules/dat-gui/index.js';

WTF.is('Rodin.JS v0.0.1');

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

let time = RODIN.Time.getInstance();
let GUIparams = null;
let gui = null;

document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);

var controls = new THREE.VRControls(camera);
controls.standing = true;

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var params = {
    hideButton: false,
    isUndistorted: false
};
var manager = new WebVRManager(renderer, effect, params);

requestAnimationFrame(animate);
generateGUI();

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

function animate (timestamp) {
    updateGUI();
    controls.update();
    manager.render(scene, camera, timestamp);
    RODIN.Objects.map(obj => obj.emit('update', new RODIN.Event(obj)));
    TWEEN.update();
    requestAnimationFrame(animate);
    time.tick();
}

function onResize (e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

let cube = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshPhongMaterial({ color: 0x336699 })));
cube.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.set(0, controls.userHeight, -1);
});

cube.on('update', (evt) => {
    evt.target.object3D.rotation.y += time.deltaTime() / 1000;
    evt.target.object3D.rotation.z += time.deltaTime() / 2000;
});

var directionalLight1 = new THREE.PointLight(0xffffff, 0.5);
directionalLight1.position.set(-1, controls.userHeight * 2, -1);
scene.add(directionalLight1);


var directionalLight2 = new THREE.PointLight(0xffffff, 0.5);
directionalLight2.position.set(1, controls.userHeight * 2, -1);
scene.add(directionalLight2);


var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

function generateGUI () {
    var Params = function () {
        this.timeSpeed = 1;
        this.startTime = time.startTime;
        this.now = 0;
    };

    GUIparams = new Params();

    gui = new GUI.GUI();
    let events = 'click  mousedown';
    events.split(' ').map(e =>
        gui.domElement.addEventListener(e, (evt) => {
            evt.stopPropagation();
        })
    );

    gui.add(GUIparams, 'timeSpeed', 0, 10).onChange(function(newValue) {
        time.speed = newValue;
    });

    gui.add(GUIparams, 'startTime', time.startTime);
    gui.add(GUIparams, 'now');
}

function updateGUI () {
    if(gui) {
        GUIparams.now = time.now();
        for(let i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    }
}