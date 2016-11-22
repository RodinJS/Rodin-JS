import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';

let scene = SceneManager.get();

scene.add(new THREE.AmbientLight());
let dl = new THREE.DirectionalLight();
dl.position.set(1, 1, 1);
scene.add(dl);

let cube = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshLambertMaterial({color: 0x336699})));
cube.on('ready', (evt) => {
    evt.target.object3D.position.set(0, scene.controls.userHeight, -0.5);
    scene.add(evt.target.object3D);
    RODIN.Raycastables.push(evt.target.object3D);
});

cube.on('update', (evt) => {
    if(!evt.target.animator.isPlaying()) {
        evt.target.object3D.rotation.y += RODIN.Time.deltaTime() / 500;
        evt.target.object3D.rotation.x += RODIN.Time.deltaTime() / 1000;
    }
});
