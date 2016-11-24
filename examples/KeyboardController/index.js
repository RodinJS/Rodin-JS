import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {KeyboardController} from '../../_build/js/rodinjs/controllers/KeyboardController.js';
import {EVENT_NAMES, KEY_CODES} from '../../_build/js/rodinjs/constants/constants.js';
import {OBJModelObject} from '../../_build/js/rodinjs/sculpt/OBJModelObject.js';


let scene = SceneManager.get();
scene.add(new THREE.AmbientLight());
scene.setCameraProperty('far', 100);
let dl = new THREE.DirectionalLight();
dl.position.set(1, 1, 1);
scene.add(dl);

SceneManager.addController(new KeyboardController());

let player = new RODIN.THREEObject(new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), new THREE.MeshLambertMaterial({ color: 0x336699, wireframe: true })));

player.on('ready', (evt) => {
    evt.target.object3D.position.y = scene.controls.userHeight;
    evt.target.object3D.position.z = - 0.25;
    scene.add(evt.target.object3D);

    evt.target.object3D.add(new THREE.AxisHelper(0.15));
});

player.speed = 0;

player.on('update', (evt) => {
    if(KeyboardController.getKey(KEY_CODES.W)) {
        evt.target.object3D.rotateX(RODIN.Time.deltaTime() / 1000);
    }

    if(KeyboardController.getKey(KEY_CODES.S)) {
        evt.target.object3D.rotateX(- RODIN.Time.deltaTime() / 1000);
    }

    if (KeyboardController.getKey(KEY_CODES.A)) {
        evt.target.object3D.rotateY(RODIN.Time.deltaTime() / 1000);
    }

    if(KeyboardController.getKey(KEY_CODES.D)) {
        evt.target.object3D.rotateY(- RODIN.Time.deltaTime() / 1000);
    }
});

player.on(EVENT_NAMES.GLOBALS.CONTROLLER_KEY_DOWN, (evt) => {
    if (evt.keyCode === KEY_CODES.SPACE) {
        player.object3D.scale.set(1.1, 1.1, 1.1);
    }
});

player.on(EVENT_NAMES.GLOBALS.CONTROLLER_KEY_UP, (evt) => {
    if (evt.keyCode === KEY_CODES.SPACE) {
        player.object3D.scale.set(1, 1, 1);
    }
});
