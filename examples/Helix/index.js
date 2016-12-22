import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {MouseGamePad} from '../../_build/js/rodinjs/controllers/gamePads/MouseGamePad.js';
import {Element} from '../../_build/js/rodinjs/sculpt/elements/Element.js';
import {ANIMATION_TYPES} from '../../_build/js/rodinjs/constants/constants.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';
import {EVENT_NAMES} from '../../_build/js/rodinjs/constants/constants.js';
import {initControllers} from './controllers_c.js';

let buttons = MouseGamePad.getInstance().buttons;

const animations = {
    hover: new Animation('hover', {
        scale: { x: 1.1, y: 1.1, z: 1.1 }
    }),
    hoverOut: new Animation('hoverOut', {
        scale: { x: 1, y: 1, z: 1 }
    })
};
animations.hover.duration(200);
animations.hoverOut.duration(200);

let scene = SceneManager.get();
let mouseController = new MouseController();
SceneManager.addController(mouseController);

mouseController.onValueChange = function (keyCode) {
    const value = buttons[keyCode - 1].value;
    const direction = value - buttons[keyCode - 1].prevValue > 0 ? 1 : -1;
    helix.concentrate(helix.center + direction);
    buttons[keyCode - 1].prevValue = value;
};

let helix = new RODIN.THREEObject(new THREE.Object3D());
helix.thumbs = [];
helix.center = 0;
helix.concentrate = function (center) {
    if (center < 0 || center > this.thumbs.length - 1) return;
    helix.center = center;
    let k = 4;
    for (let i = 0; i < this.thumbs.length; i++) {
        const thumb = this.thumbs[i];
        thumb.index = i;
        thumb.alpha = (i - center) / k;
    }
};
helix.addThumb = function (thumb) {
    this.thumbs.push(thumb);
    this.concentrate(this.center);
};

helix.on('ready', () => {
    helix.object3D.position.z = -1;
    scene.add(helix.object3D);
    helix.concentrate(0);
});

class HelixThumb extends Element {
    constructor (thumbParams) {
        let params = {
            width: 0.9,
            height: 0.6,
            image: {
                url: thumbParams.image,
                width: 0.9,
                height: 0.6,
                opacity: 1,
                position: { h: 50, v: 50 }
            }
        };
        super(params);

        this.on('ready', () => {
            this.forceHover = true;
            this.object3D.position.y = scene.controls.userHeight;
            this.raycastable = true;
            helix.object3D.add(this.object3D);
            this.animator.add(animations.hover);
            this.animator.add(animations.hoverOut);
            this.uv = { x: .5, y: .5 };
        });

        this.on('update', () => {
            if (!this.hasOwnProperty('alpha')) return;
            let currentAlpha = this.currentAlpha || 0;
            currentAlpha = currentAlpha + (this.alpha - currentAlpha) / RODIN.Time.deltaTime();
            const alpha = Math.max(-1, Math.min(currentAlpha, 1));
            this.object3D.material.opacity = 1 - Math.abs(alpha);
            this.object3D.position.x = 2 * alpha;
            this.object3D.position.z = -Math.abs(alpha);
            this.object3D.rotation.y = -Math.PI / 2 * alpha;
            this.object3D.rotation.x = 0;
            this.currentAlpha = currentAlpha;

            if (this.uv) {
                let currentUV = this.currentUV || { x: 0, y: 0 };
                currentUV.x = currentUV.x + (this.uv.x - currentUV.x) / RODIN.Time.deltaTime();
                currentUV.y = currentUV.y + (this.uv.y - currentUV.y) / RODIN.Time.deltaTime();
                this.object3D.rotation.y += (currentUV.x - 0.5) / 4;
                this.object3D.rotation.x += (0.5 - currentUV.y) / 2;
                this.currentUV = currentUV;
            }
        });

        this.on(EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            this.uv = evt.uv;
        });

        this.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
            this.uv = { x: .5, y: .5 }
        });

        this.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            this.hasOwnProperty("index") && helix.concentrate(this.index);
        })
    }
}

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
        image: projects[i]
    }));
}

initControllers();
