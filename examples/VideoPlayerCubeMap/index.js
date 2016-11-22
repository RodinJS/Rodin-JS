import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeMapFromModel} from '../../_build/js/rodinjs/sculpt/CubeMapFromModel.js';
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

//// TODO by Lyov: ask Aram for fix far problem
//// TODO by Aram: OK Lyov, I'll check.
scene.setCameraProperty("far", 1000);


let player = new MaterialPlayer("video/test2.mp4");
let material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: player.getTextureL()
});


// Add a skybox.
let boxSize = 150;
let skybox = new CubeMapFromModel(0, boxSize, null, material);

skybox.on('ready', () => {
    scene.add(skybox.object3D);
    skybox.object3D.position.y = controls.userHeight;
});


scene.preRender(function () {
    player.update(RODIN.Time.deltaTime());
});

renderer.domElement.addEventListener("click", () => {
    player.playPause();
});