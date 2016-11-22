import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import * as GUI from '../../_build/js/vendor/dat-gui/index.js';

let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let mouseController = new MouseController();
SceneManager.addController(mouseController);

let GUIparams = null;
let gui = null;

/// update TWEEN before start rendering
scene.preRender(function () {
    TWEEN.update();
    updateGUI();
});

let skybox = new CubeObject(15, 'img/boxW.jpg');
skybox.on(RODIN.CONSTANTS.EVENT_NAMES.READY, (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.y = scene.controls.userHeight;
});

let cube = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshPhongMaterial({color: 0x336699})));
cube.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.set(0, controls.userHeight, -1);
});

cube.on('update', (evt) => {
    evt.target.object3D.rotation.y += RODIN.Time.deltaTime() / 1000;
    evt.target.object3D.rotation.z += RODIN.Time.deltaTime() / 2000;
});

let directionalLight1 = new THREE.PointLight(0xffffff, 0.5);
directionalLight1.position.set(-1, controls.userHeight * 2, -1);
scene.add(directionalLight1);


let directionalLight2 = new THREE.PointLight(0xffffff, 0.5);
directionalLight2.position.set(1, controls.userHeight * 2, -1);
scene.add(directionalLight2);


let ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);


generateGUI();

function generateGUI() {
    let Params = function () {
        this.timeSpeed = 1;
        this.startTime = RODIN.Time.startTime;
        this.now = 0;
    };

    GUIparams = new Params();

    gui = new GUI.GUI();
    let events = 'click  mousedown';
    events.split(' ').map(e =>
        gui.domElement.addEventListener(e, (evt) => {
            evt.stopPropagation();
        })
    );

    gui.add(GUIparams, 'timeSpeed', 0, 10).onChange(function (newValue) {
        RODIN.Time.speed = newValue;
    });

    gui.add(GUIparams, 'startTime', RODIN.Time.startTime);
    gui.add(GUIparams, 'now');
}


function updateGUI() {
    if (gui) {
        GUIparams.now = RODIN.Time.now();
        for (let i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    }
}