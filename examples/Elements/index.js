import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';


import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {Element} from '../../_build/js/rodinjs/sculpt/elements/Element.js';

let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let mouseController = new MouseController();
SceneManager.addController(mouseController);
scene.scene.background = new THREE.Color(0x383838);

let i = 50;
while (i--) {
    let r = Math.randomIntIn(1, 3);
    let params = {};
    params.name = "name_";
    params.width = 0.8;
    params.height = 0.8;
    params.background = {
        color: 0xaaaaaa,
        opacity: 0.2
        //image: {
        //    url: "./img/test.jpg"
        //}
    };
    params.border = {
        width: 0.01,
        color: 0xff8800,
        opacity: 1,
        radius: 0.4
    };
    params.label = {
        text: "Rodin " + i,
        fontFamily: "Arial",
        fontSize: 0.11,
        color: 0xffffff,
        opacity: 1,
        position: {h: 50, v: 80}
    };
    params.image = {
        url: "./img/rodin.png",
        width: 0.3,
        height: 0.4,
        opacity: 1,
        position: {h: 50, v: 43}
    };

    let button = new Element(params);
    button.on('ready', (evt) => {
        let object = evt.target.object3D;
        //object.position.z = -1;
        //object.position.y = 1.6;
        object.position.x = Math.randomFloatIn(-5.3, 5.3);
        object.position.y = Math.randomFloatIn(-5.3, 5.3);
        object.position.z = Math.randomFloatIn(-5.3, 5.3);

        object.castShadow = true;
        object.receiveShadow = true;
        scene.add(object);
        RODIN.Raycastables.push(object);
        evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            evt.target.animate(
                {
                    property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
                    to: new THREE.Vector3(1.1, 1.1, 1.1)
                }
            );

        });
        evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            evt.target.animate(
                {
                    property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
                    to: new THREE.Vector3(1, 1, 1)
                }
            );

        });
    });
    button.on('update', (evt) => {
        evt.target.object3D.rotation.y += 0.01 * r;
    });

}

/// update TWEEN before start rendering
scene.preRender(function () {
    TWEEN.update();
});
