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

camera.far = 150;

let player = new MaterialPlayer("video/test2.mp4");
let material = new THREE.MeshBasicMaterial({
    map: player.getTextureL()
});


let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(30, 720, 4), material);
sphere.scale.set(1, 1, -1);
scene.add(sphere);

scene.preRender(function () {
    player.update(RODIN.Time.deltaTime());
});

renderer.domElement.addEventListener("click", () => {
    player.playPause();
});