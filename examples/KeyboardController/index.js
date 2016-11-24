import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {KeyboardController} from '../../_build/js/rodinjs/controllers/KeyboardController.js';
import {EVENT_NAMES, KEY_CODES} from '../../_build/js/rodinjs/constants/constants.js';
import {OBJModelObject} from '../../_build/js/rodinjs/sculpt/OBJModelObject.js';


let scene = SceneManager.get();
scene.add(new THREE.AmbientLight());
let dl = new THREE.DirectionalLight();
dl.position.set(1, 1, 1);
scene.add(dl);

SceneManager.addController(new KeyboardController());

let geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
let material = new THREE.MeshLambertMaterial({ color: 0x6699bb });

for (let i = 0; i < 5000; i++) {
    let cube = new RODIN.THREEObject(new THREE.Mesh(geometry, material));
    cube.on('ready', (evt) => {
        evt.target.object3D.position.set(Math.randomFloatIn(-500, 500), Math.randomFloatIn(-500, 500), Math.randomFloatIn(-500, 500));
        scene.add(evt.target.object3D);
    });

    cube.on('update', (evt) => {
        evt.target.object3D.rotation.y += RODIN.Time.deltaTime() / 500;
    });
}

let player = new RODIN.THREEObject(new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), new THREE.MeshLambertMaterial({ color: 0x336699, wireframe: true })));

player.on('ready', (evt) => {
    evt.target.object3D.position.y = scene.controls.userHeight;
    scene.add(evt.target.object3D);
});

player.speed = 0;

player.on('update', (evt) => {
    evt.target.object3D.translateZ(-RODIN.Time.deltaTime() / 2000 * player.speed);

    if(KeyboardController.getKey(KEY_CODES.W)) {
        player.speed ++;
    } else {
        if(player.speed > 0) {
            player.speed -= 2;

        }
    }

    if (KeyboardController.getKey(KEY_CODES.A)) {
        evt.target.object3D.rotateY(RODIN.Time.deltaTime() / 2000);
    }

    if(KeyboardController.getKey(KEY_CODES.D)) {
        evt.target.object3D.rotateY(-RODIN.Time.deltaTime() / 2000);
    }

    scene.camera.position.copy(evt.target.object3D.position);
    scene.camera.position.add(evt.target.forward);
    scene.camera.lookAt(evt.target.object3D.position);
});

player.on(EVENT_NAMES.GLOBALS.CONTROLLER_KEY_DOWN, (evt) => {
    if (evt.getKey(KEY_CODES.W)) {
        // player.object3D.position.x += RODIN.Time.deltaTime() / 1000;
    }
});
