import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseGamePad} from '../../_build/js/rodinjs/controllers/gamePads/MouseGamePad.js';
import {Element} from '../../_build/js/rodinjs/sculpt/elements/Element.js';
import {THREEObject} from '../../_build/js/rodinjs/sculpt/THREEObject.js';
import {EVENT_NAMES} from '../../_build/js/rodinjs/constants/constants.js';

import * as controllers from './controllers_c.js';
import './objects/platform_c.js';
import './objects/lights_c.js';
import {Helix} from './objects/Helix_c.js';
import {HelixThumb} from './objects/HelixThumb_c.js';
import {Popup} from './objects/Popup_c.js';
import * as icons from './objects/icons_c.js';

const helix = new Helix();
helix.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.z = -2.5;
    evt.target.object3D.position.y = scene.controls.userHeight;
});

let buttons = MouseGamePad.getInstance().buttons;

let scene = SceneManager.get();
scene.setCameraProperty('fov', 70);
scene.scene.background = new THREE.Color(0xc8c8c8);

controllers.mouse.onValueChange = function (keyCode) {
    const value = buttons[keyCode - 1].value;
    const direction = value - buttons[keyCode - 1].prevValue > 0 ? 1 : -1;
    helix.concentrate(helix.center + direction);
    buttons[keyCode - 1].prevValue = value;
};

let projects = [
    "./img/thumb1.jpg",
    "./img/thumb2.jpg",
    "./img/thumb3.jpg",
    "./img/thumb4.jpg",
    "./img/thumb5.jpg",
    "./img/thumb6.jpg",
    "./img/thumb7.jpg",
    "./img/thumb8.jpg",
    "./img/thumb9.jpg",
    "./img/thumb10.jpg",
    "./img/thumb11.jpg",
    "./img/thumb12.jpg",
    "./img/thumb1.jpg",
    "./img/thumb2.jpg",
    "./img/thumb3.jpg",
    "./img/thumb4.jpg",
    "./img/thumb5.jpg",
    "./img/thumb6.jpg",
    "./img/thumb7.jpg",
    "./img/thumb8.jpg",
    "./img/thumb9.jpg",
];

for (let i = 0; i < projects.length; i++) {
    helix.addThumb(new HelixThumb({
        image: projects[i],
        name: projects[i]
    }));
}