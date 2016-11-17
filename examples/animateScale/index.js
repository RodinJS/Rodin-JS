import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {WTF} from '../../_build/js/rodinjs/RODIN.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';

WTF.is(RODIN);

import '../../_build/js/vendor/three/examples/js/controls/VRControls.js';
import '../../_build/js/vendor/three/examples/js/effects/VREffect.js';
import * as GUI from '../../_build/js/vendor/dat-gui/index.js';

WTF.is('Rodin.JS v0.0.1');

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);

var controls = new THREE.VRControls(camera);
controls.standing = true;

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var distanceRatio = 1;

var boxSize = 15 * distanceRatio;
var loader = new THREE.TextureLoader();
loader.load('img/boxW.png', onTextureLoaded);

function onTextureLoaded(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(boxSize, boxSize);

    var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });

    var skybox = new THREE.Mesh(geometry, material);

    scene.add(skybox);
    skybox.position.y = boxSize / 2 - controls.userHeight;
    setupStage();
}

var params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);

class CardboardObject extends RODIN.JSONModelObject {
    constructor(id) {
        super(id, "./model/cardboard/cardboard.js" );
    }
}



var light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(1, 1, 1);
scene.add(light1);

var light2 = new THREE.DirectionalLight(0xffffff);
light2.position.set(-1, -1, -1);
scene.add(light2);

var amlight = new THREE.AmbientLight(0x222222);
scene.add(amlight);

let cardboard = new CardboardObject();
cardboard.on('ready', () => {
    cardboard.object3D.position.x = -3;
    cardboard.object3D.position.z = -5;
    cardboard.object3D.scale.set(0.01, 0.01, 0.01);
    console.log(cardboard.object3D);
    //cardboard.object3D.material.materials[0] = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("./model/cardboard/cardboard_m.jpg"), color:0xffffff});
    scene.add(cardboard.object3D);
});

cardboard.on('update', (event) => {
    event.target.object3D && (event.target.object3D.rotation.y += 0.01);
});

requestAnimationFrame(animate);
generateGUI();

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

var lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    controls.update();
    manager.render(scene, camera, timestamp);
    RODIN.Objects.map( obj => obj.emit('update', new RODIN.Event(obj), delta));
    TWEEN.update();
    requestAnimationFrame(animate);
}

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

var display;

function setupStage() {
    navigator.getVRDisplays().then(function (displays) {
        if (displays.length > 0) {
            display = displays[0];
            if (display.stageParameters) {
                setStageDimensions(display.stageParameters);
            }
        }
    });
}

function setStageDimensions(stage) {
    if (stage.sizeX === 0 || stage.sizeZ === 0) return;

    var material = skybox.material;
    scene.remove(skybox);

    var geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
    skybox = new THREE.Mesh(geometry, material);

    skybox.position.y = boxSize / 2;
    scene.add(skybox);
}

function generateGUI() {

    var FizzyText = function() {
        this.x = 0.01;
        this.y = 0.01;
        this.z = 0.01;
        this.duration = 3000;
        this.start = function () {
            cardboard && cardboard.object3D && cardboard.animate(
                {
                    duration: this.duration,
                    to: new THREE.Vector3(this.x, this.y, this.z),
                    property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
                    easing: TWEEN.Easing.Linear.None
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

    gui.add(text, 'x', 0.001, 0.05);
    gui.add(text, 'y', 0.001, 0.05);
    gui.add(text, 'z', 0.001, 0.05);
    gui.add(text, 'duration', 1, 20000);
    gui.add(text, 'start');
}