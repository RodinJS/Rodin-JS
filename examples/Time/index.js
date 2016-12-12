import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import * as GUI from '../../_build/js/vendor/dat-gui/index.js';

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

let GUIparams = null;
let gui = null;

/// update TWEEN before start rendering
scene.preRender(function () {
    TWEEN.update();
    updateGUI();
});

let cube = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshPhongMaterial({color: 0x336699})));
cube.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.set(0, controls.userHeight, -1);
});

cube.on('update', (evt) => {
    evt.target.object3D.rotation.y += RODIN.Time.deltaTime() / 1000;
    evt.target.object3D.rotation.z += RODIN.Time.deltaTime() / 2000;
});

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