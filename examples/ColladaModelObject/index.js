import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';

let scene = SceneManager.get();
scene.scene.background = new THREE.Color(0xb5b5b5);

let controls = scene.controls;

let mouseController = new MouseController();
SceneManager.addController(mouseController);

let floor = new RODIN.THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(25, 25, 50, 50), new THREE.MeshLambertMaterial({color: 0x869295, wireframe:true})));
floor.on('ready', (e) => {
    scene.add(e.target.object3D);
    e.target.object3D.rotation.x = Math.PI/2;
});

/// Add light
let light1 = new THREE.DirectionalLight(0xcccccc);
light1.position.set(2, 3, 2);
scene.add(light1);

scene.add(new THREE.AmbientLight(0xaaaaaa));

let light2 = new THREE.DirectionalLight(0xb5b5b5);
light2.position.set(-3, -3, -3);
scene.add(light2);

let obj = ModelLoader.load('./model/avatar.dae');
obj.on('ready', () => {
    let s = 1.1;
    obj.object3D.scale.set(s, s, s);
    obj.object3D.rotation.x = -Math.PI / 2;
    obj.object3D.position.z = -1.5;
    obj.object3D.position.y = controls.userHeight - 1.6;
    scene.add(obj.object3D);
});

obj.on('update', () => {
    obj.object3D && (obj.object3D.rotation.z += RODIN.Time.deltaTime()/2000);
});