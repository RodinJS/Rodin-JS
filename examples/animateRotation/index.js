import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';
import * as GUI from '../../_build/js/vendor/dat-gui/index.js';

let scene = SceneManager.get();
let mouseController = new MouseController();
SceneManager.addController(mouseController);

/// update TWEEN before start rendering
scene.preRender(TWEEN.update.bind(TWEEN));

let skybox = new CubeObject(15, 'img/boxW.jpg');
skybox.on(RODIN.CONSTANTS.EVENT_NAMES.READY, (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.y = scene.controls.userHeight;
});

let light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(1, 1, 1);
scene.add(light1);

let light2 = new THREE.DirectionalLight(0xffffff);
light2.position.set(-1, -1, -1);
scene.add(light2);

let amlight = new THREE.AmbientLight(0x222222);
scene.add(amlight);

let cardboard = ModelLoader.load('./model/cardboard/cardboard.js');
cardboard.on('ready', () => {
    cardboard.object3D.position.x = -3;
    cardboard.object3D.position.z = -5;
    cardboard.object3D.scale.set(0.01, 0.01, 0.01);
    scene.add(cardboard.object3D);
});

cardboard.on('update', (event) => {
    event.target.object3D && (event.target.object3D.rotation.y += 0.01);
});

generateGUI();

function generateGUI() {

    let FizzyText = function() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.duration = 1000;
        this.start = function () {
            cardboard && cardboard.object3D && cardboard.animate(
                {
                    duration: this.duration,
                    to: new THREE.Vector3(this.x, this.y, this.z),
                    property: RODIN.CONSTANTS.ANIMATION_TYPES.ROTATION
                }
            )
        }
    };

    let text = new FizzyText();

    let gui = new GUI.GUI();
    let events = 'click  mousedown';
    events.split(' ').map( e =>
        gui.domElement.addEventListener(e, (evt) => {
            evt.stopPropagation();
        })
    );

    gui.add(text, 'x', -5, 5);
    gui.add(text, 'y', -5, 5);
    gui.add(text, 'z', -5, 5);
    gui.add(text, 'duration', 1, 20000);
    gui.add(text, 'start');
}