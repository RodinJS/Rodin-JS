import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../../_build/js/rodinjs/controllers/MouseController.js';
import {MouseGamePad} from '../../../_build/js/rodinjs/controllers/gamePads/MouseGamePad.js';
import {Element} from '../../../_build/js/rodinjs/sculpt/elements/Element.js';
import {THREEObject} from '../../../_build/js/rodinjs/sculpt/THREEObject.js';
import {ANIMATION_TYPES} from '../../../_build/js/rodinjs/constants/constants.js';
import {Animation} from '../../../_build/js/rodinjs/animation/Animation.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';

export class HelixThumb extends THREEObject {
    constructor (thumbParams, helix) {
        super(new THREE.Object3D());

        let params = {
            width: 0.9,
            height: 0.6,
            image: {
                url: thumbParams.image,
                width: 0.9,
                height: 0.6,
                opacity: 1,
                position: { h: 50, v: 50 }
            },
            border: {
                radius: 0.015
            }
        };

        this.helix = helix;
        this.thumb = new Element(params);
        this.thumb.on('ready', () => {
            this.object3D.add(this.thumb.object3D);
            this.thumb.raycastable = true;
            this.thumb.forceHover = true;
        });

        this.thumb.on('update', () => {
            let currentAlpha = this.currentAlpha || 0;
            currentAlpha = currentAlpha + (this.alpha - currentAlpha) / RODIN.Time.deltaTime();
            const alpha = Math.max(-1, Math.min(currentAlpha, 1));
            this.thumb.object3D.material.opacity = 1 - Math.abs(alpha);

            if (this.uv) {
                let currentUV = this.currentUV || { x: 0, y: 0 };
                currentUV.x = currentUV.x + (this.uv.x - currentUV.x) / RODIN.Time.deltaTime();
                currentUV.y = currentUV.y + (this.uv.y - currentUV.y) / RODIN.Time.deltaTime();
                this.thumb.object3D.rotation.y = (currentUV.x - 0.5) / 12;
                this.thumb.object3D.rotation.x = (0.5 - currentUV.y) / 6;
                this.currentUV = currentUV;
            }
        });

        this.thumb.on(EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            this.uv = evt.uv;
        });

        this.thumb.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
            this.uv = { x: .5, y: .5 }
        });

        this.thumb.on(EVENT_NAMES.CONTROLLER_KEY, () => {
            this.helix.concentrate(this.index);
        });

        this.on('ready', () => {
            this.helix.object3D.add(this.object3D);
            this.uv = { x: .5, y: .5 };
        });

        this.on('update', () => {
            if (!this.hasOwnProperty('alpha')) return;
            let currentAlpha = this.currentAlpha || 0;
            currentAlpha = currentAlpha + (this.alpha - currentAlpha) / RODIN.Time.deltaTime();
            const alpha = Math.max(-1, Math.min(currentAlpha, 1));
            this.object3D.position.x = 2.5 * alpha;
            this.object3D.position.z = -1.3 * Math.abs(alpha);
            this.object3D.rotation.y = -Math.PI / 2 * alpha;
            this.object3D.rotation.x = 0;
            this.currentAlpha = currentAlpha;
        });
    }
}