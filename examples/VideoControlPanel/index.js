import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {MaterialPlayer} from '../../_build/js/rodinjs/video/MaterialPlayer.js';
import {VPcontrolPanel} from './VPcontrolPanel_c.js';
import '../../_build/js/rodinjs/utils/Math.js';


let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let mouseController = new MouseController();
SceneManager.addController(mouseController);

camera.far = 150;

let player = new MaterialPlayer({
    HD: "video/test1.mp4",
    SD: "video/test2.mp4",
    default: "HD"
});

let material = new THREE.MeshBasicMaterial({
    map: player.getTextureL()
});


let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(30, 720, 4), material);
sphere.scale.set(1, 1, -1);
scene.add(sphere);

scene.preRender(function () {
    player.update(RODIN.Time.deltaTime());
});

let controlPanel = new VPcontrolPanel({player : player, title: "A sample 360° video", distance: 1.5, width: 2.25});

controlPanel.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.y = controls.userHeight;
});