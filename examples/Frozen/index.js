import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {THREEObject} from '../../_build/js/rodinjs/sculpt/THREEObject.js';
import {timeout} from '../../_build/js/rodinjs/utils/timeout.js';
import {Interval} from '../../_build/js/rodinjs/utils/interval.js';
import {Snow} from '../../_build/js/rodinjs/sculpt/Snow.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let mouseController = new MouseController();
SceneManager.addController(mouseController);

let snowContainer = new THREE.Object3D();

// Add a skybox.
let boxSize = 21;
let snowBoxSize = 18;
let skybox = new CubeObject(boxSize, 'img/portals/frozen/room/bg/SD/horizontalSkyBox1.jpg');

skybox.on('ready', () => {
    scene.add(skybox.object3D);
    skybox.object3D.position.y = controls.userHeight;
    skybox.object3D.rotation.y = -Math.PI / 2;
    skybox.object3D.add(snowContainer);
    snowContainer.rotation.y = -Math.PI / 2;
    snowContainer.position.y = -boxSize / 2 + snowBoxSize / 2;
    scene.add(object1);
});

let snow = new Snow(0,
    'img/particle_snow2.png',
    snowBoxSize,
    0.03,
    3,
    0.2,
    1
);

snow.on("ready", (evt) => {
    evt.target.object3D.renderOrder = 1;
    snowContainer.add(evt.target.object3D);
});

let geometry1 = new THREE.PlaneGeometry(10, 12, 2, 2);
let texture1 =  new THREE.TextureLoader().load("img/portals/frozen/characters.png");

let material1 = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture1,
    transparent:true,
    depthWrite: false
});

let object1 = new THREE.Mesh(geometry1, material1);
object1.position.x = 0;
object1.position.y = 0;
object1.position.z = -9.5;
//object1.rotation.y = Math.PI;
object1.scale.set(.5,.5,.5);
let obj = new THREEObject(object1);

obj.on('ready', () => {
});
