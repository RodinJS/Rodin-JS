import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {timeout} from '../../_build/js/rodinjs/utils/timeout.js';
import {Interval} from '../../_build/js/rodinjs/utils/interval.js';
import {MaterialPlayer} from '../../_build/js/rodinjs/video/MaterialPlayer.js';
import '../../_build/js/rodinjs/utils/Math.js';


let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let mouseController = new MouseController();
SceneManager.addController(mouseController);

camera.fov = 75;
camera.far = 50;

let player = new MaterialPlayer("video/1.mp4", true);
let materialL = new THREE.MeshBasicMaterial({
    map: player.getTextureL()
});
let materialR = new THREE.MeshBasicMaterial({
    map: player.getTextureR()
});

let sphereL = new THREE.Mesh(new THREE.SphereBufferGeometry(30, 720, 4), materialL);
sphereL.scale.set(-1,1,1);
sphereL.layers.enable(1);
scene.add(sphereL);

let sphereR = new THREE.Mesh(new THREE.SphereBufferGeometry(30, 720, 4), materialR);
sphereR.scale.set(-1,1,1);
sphereR.layers.set(2);
scene.add(sphereR);


scene.preRender(function () {
    player.update(RODIN.Time.deltaTime());
});

renderer.domElement.addEventListener("click", () => {
    player.playPause();
});