import {Element} from "../../../_build/js/rodinjs/sculpt/elements/Element.js";
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';

import {HoverableElement} from './HoverableElement_c.js';

const scene = SceneManager.get();

export class OpeningIcon extends HoverableElement {
    constructor () {
        super(arguments[0], arguments[1]);

        this.side = arguments[3] || 'left';

        this.on('ready', () => {
            this.slider = new Element(arguments[2]);

            this.slider.on('ready', () => {
                this.slider.object3D.scale.x = 0;
                this.slider.object3D.position.z = - 0.01;
                this.object3D.add(this.slider.object3D);

                let x;
                if(this.side === 'left') {
                    x = - arguments[2].width / 2 + arguments[2].height / 2;
                } else {
                    x = arguments[2].width / 2 - arguments[2].height / 2;
                }

                this.slider.object3D.position.x = x;
            });

            this.on(EVENT_NAMES.CONTROLLER_HOVER, () => {
                this.slider.object3D.scale.x = 1;
            });

            this.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
                this.slider.object3D.scale.x = 0;
            });
        });
    }
}

const iconSize = 0.18;

export const _public = new OpeningIcon(
    {
        width: iconSize,
        height: iconSize,
        image: {
            url: './img/public.png',
            width: iconSize,
            height: iconSize,
            opacity: 1,
            position: { h: 50, v: 50 }
        },
        border: {
            radius: iconSize / 2
        }
    },
    {
        width: iconSize,
        height: iconSize,
        image: {
            url: './img/public_active.png',
            width: iconSize,
            height: iconSize,
            opacity: 1,
            position: { h: 50, v: 50 }
        },
        border: {
            radius: iconSize / 2
        }
    },
    {
        width: .7,
        height: iconSize,
        background: {
            color: 0x00bcff
        },
        border: {
            radius: iconSize / 2
        },
        label: {
            text: "Public Projects        ",
            color: 0x231f20,
            position: { h: 50, v: 52 },
            fontSize: 0.06
        },
        ppm: 1000
    },
    'left'
);

_public.on('ready', (evt) => {
    evt.target.object3D.position.z = -2.5;
    evt.target.object3D.position.y = scene.controls.userHeight + .65;
    evt.target.object3D.position.x = - .15;
    scene.add(evt.target.object3D);
});


export const _personal = new OpeningIcon(
    {
        width: iconSize,
        height: iconSize,
        image: {
            url: './img/personal.png',
            width: iconSize,
            height: iconSize,
            opacity: 1,
            position: { h: 50, v: 50 }
        },
        border: {
            radius: iconSize / 2
        }
    },
    {
        width: iconSize,
        height: iconSize,
        image: {
            url: './img/personal_active.png',
            width: iconSize,
            height: iconSize,
            opacity: 1,
            position: { h: 50, v: 50 }
        },
        border: {
            radius: iconSize / 2
        }
    },
    {
        width: .8,
        height: iconSize,
        background: {
            color: 0x00bcff
        },
        border: {
            radius: iconSize / 2
        },
        label: {
            text: "        Personal Projects",
            color: 0x231f20,
            position: { h: 50, v: 52 },
            fontSize: 0.06
        }
    },
    'right'
);

_personal.on('ready', (evt) => {
    evt.target.object3D.position.z = -2.5;
    evt.target.object3D.position.y = scene.controls.userHeight + .65;
    evt.target.object3D.position.x = .15;
    scene.add(evt.target.object3D);
});
