import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {OculusController} from '../../_build/js/rodinjs/controllers/OculusController.js';
import {MaterialPlayer} from '../../_build/js/rodinjs/video/MaterialPlayer.js';
import {VPcontrolPanel} from './VPcontrolPanel_c.js';
import '../../_build/js/rodinjs/utils/Math.js';


let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let mouseController = new MouseController();
let oculusController = new OculusController();

SceneManager.addController(mouseController);
SceneManager.addController(oculusController);

scene.setCameraProperty("far", 350);
scene.setCameraProperty("fov", 70);

let player = new MaterialPlayer({
    HD: "video/test.mp4",
    SD: "video/test1.mp4",
    LD: "video/test2.mp4",
    default: "SD"
});

let material = new THREE.MeshBasicMaterial({
    map: player.getTextureL()
});


let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(300, 720, 4), material);
sphere.scale.set(1, 1, -1);
scene.add(sphere);

scene.preRender(function () {
    player.update(RODIN.Time.deltaTime());
});

let controlPanel = new VPcontrolPanel({
    player : player,
    title: "A sample 360° drone video",
    distance: 3,
    width: 3,
    controllers: [mouseController, oculusController]
});

controlPanel.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.y = controls.userHeight;
});