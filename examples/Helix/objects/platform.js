import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {ModelLoader} from '../../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {Element} from '../../../_build/js/rodinjs/sculpt/elements/Element.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';
import {Animation} from '../../../_build/js/rodinjs/animation/Animation.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';

import {about} from './Popup_c.js';

const scene = SceneManager.get();

export const platform = ModelLoader.load('./models/platform/landscape.obj');

platform.on('ready', () => {
    console.log('ready');
    scene.add(platform.object3D);
});

export const aboutButton = new Element(
    {
        width: 0.614,
        height: 0.276,
        image: {
            width: 0.614,
            height: 0.276,
            url: './img/about_button.png',
            opacity: 1,
            position: { h: 50, v: 50 }
        }
    }
);

aboutButton.on('ready', () => {
    aboutButton.object3D.position.z = 2;
    aboutButton.object3D.position.y = scene.controls.userHeight;
    aboutButton.object3D.rotation.y = Math.PI;
    scene.add(aboutButton.object3D);
    aboutButton.raycastable = true;
});

aboutButton.on(EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
     evt.target.animator.start('hover');
});

aboutButton.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
    evt.target.animator.start('hoverout');
});

aboutButton.on(EVENT_NAMES.CONTROLLER_KEY_UP, () => {
    aboutButton.object3D.scale.y = 0;
    about.open();
});

about.on('close', () => {
    aboutButton.object3D.scale.y = 1;
});

aboutButton.on('update', (evt) => {
    if(!evt.target.destinationZ) return;
    const delta = evt.target.destinationZ - evt.target.object3D.position.z;
    if(Math.abs(delta) < 0.001) {
        delete evt.target.destinationZ;
        return;
    }

    evt.target.object3D.position.z += delta / RODIN.Time.deltaTime();
});

aboutButton.on(EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
    evt.target.destinationZ = 1.9;
});


aboutButton.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
    evt.target.destinationZ = 2;
});

