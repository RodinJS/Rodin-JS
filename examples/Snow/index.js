import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {timeout} from '../../_build/js/rodinjs/utils/timeout.js';
import {Interval} from '../../_build/js/rodinjs/utils/interval.js';
import {Snow} from '../../_build/js/rodinjs/sculpt/Snow.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

let scene = SceneManager.get();
let controls = scene.controls;
let mouseController = new MouseController();
SceneManager.addController(mouseController);

let light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(1, 1, 1);
scene.add(light1);

let light2 = new THREE.DirectionalLight(0x002288);
light2.position.set(-1, -1, -1);
scene.add(light2);

let amlight = new THREE.AmbientLight(0x222222);
scene.add(amlight);

let boxSize = 15;
let skybox = new CubeObject(70, 'img/boxW.jpg');
skybox.on(RODIN.CONSTANTS.EVENT_NAMES.READY, (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.y = controls.userHeight;
});

let snowObject = new THREE.Object3D();
let snow = new Snow(0,
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


let sloMoSno = new Interval(() => {
    snow.changeSpeed(0.05, 0.05);
    timeout(() => {
        snow.changeSpeed(1, 1);
    }, 3000);
}, 8000, true);
