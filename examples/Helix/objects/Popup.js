import {Element} from "../../../_build/js/rodinjs/sculpt/elements/Element.js";
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';

import {HoverableElement} from './HoverableElement_c.js';

export class Popup extends Element {
    constructor (url, width = 0.9, height = 0.6) {
        let params = {
            width: width,
            height: height,
            image: {
                url: url,
                width: width,
                height: height,
                opacity: 1,
                position: { h: 50, v: 50 }
            },
            border: {
                radius: 0.015
            }
        };

        super(params);

        const closeButtonParams = {
            width: 0.16,
            height: 0.16,
            image: {
                url: './img/close.png',
                width: 0.16,
                height: 0.16,
                opacity: 1,
                position: { h: 50, v: 50 }
            },
            border: {
                radius: 0.08
            }
        };

        const closeButtonHoverParams = Object.clone(closeButtonParams);
        closeButtonHoverParams.image.url = './img/close_active.png';

        this.closeButton = new HoverableElement(closeButtonParams, closeButtonHoverParams);
        this.closeButton.on('ready', () => {
            this.closeButton.raycastable = true;
            this.closeButton.object3D.position.z = 0.01;
            this.closeButton.object3D.position.y = height / 2;
            this.closeButton.object3D.position.x = width / 2;
            this.object3D.add(this.closeButton.object3D);
        });

        this.closeButton.on(EVENT_NAMES.CONTROLLER_HOVER, () => {
            this.closeButton.destinationZ = 0.03;
        });

        this.closeButton.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
            this.closeButton.destinationZ = 0.01;
        });

        this.closeButton.on(EVENT_NAMES.CONTROLLER_KEY, () => {
            this.close();
        });

        this.closeButton.on('update', () => {
            if(!this.closeButton.destinationZ) return;
            const delta = this.closeButton.destinationZ - this.closeButton.object3D.position.z;
            if(Math.abs(delta) < 0.001) {
                delete this.closeButton.destinationZ;
                return;
            }

            this.closeButton.object3D.position.z += delta / RODIN.Time.deltaTime();
        });
    }

    close () {
        this.object3D.scale.set(0, 0, 0);
    }

    open () {
        this.object3D.scale.set(1, 1, 1);
    }
}

const aboutPopup = new Popup('./img/not_signed_in.png', 1.474, 1.002);
aboutPopup.on('ready', () => {
    // scene.add(aboutPopup.object3D);
    aboutPopup.object3D.position.z = -2;
    // aboutPopup.object3D.position.y = scene.controls.userHeight;
});
