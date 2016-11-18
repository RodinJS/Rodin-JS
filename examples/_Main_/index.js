import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';

const time = RODIN.Time.getInstance();

const scene = new RODIN.Scene();
scene.enable();

let skybox = new RODIN.CubeObject(15, 'img/boxW.jpg');
skybox.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.y = scene.controls.userHeight;
});

let geometry = new THREE.BoxGeometry(0.015, 0.015, 0.015);
let material = new THREE.MeshNormalMaterial();

for (let i = 0; i < 1000; i++) {
    let cube = new RODIN.THREEObject(new THREE.Mesh(geometry, material));
    cube.on('ready', (evt) => {
        evt.target.object3D.position.set(1.5 * (Math.random() - 0.5), scene.controls.userHeight - 3 * (Math.random() - 0.5), 1.5 * (Math.random() - 0.5));
        scene.add(evt.target.object3D);
    });

    cube.on('update', (evt) => {
        evt.target.object3D.rotation.y += time.deltaTime() / 500;
    })
}
