import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';
import {Element} from '../../../_build/js/rodinjs/sculpt/elements/Element.js';

export class Helix extends RODIN.THREEObject {
    constructor() {
        super(new THREE.Object3D());
        this.thumbs = [];
        this.center = 0;

        this.on('ready', () => {
            this.concentrate(0);

            this.frame = new Element(
                {
                    width: 1.39,
                    height: 1.1,
                    background: {
                        color: 0x00bcff
                    },
                    border: {
                        radius: 0.03
                    },
                }
            );

            this.frame.on('ready', () => {
                this.frame.object3D.position.z = -0.08;
                this.frame.object3D.position.y = -0.08;
                this.object3D.add(this.frame.object3D);
            });

            this.frame.name = null;
        })
    }

    concentrate(center = 0) {
        this.closeFrame();
        if (center < 0 || center > this.thumbs.length - 1) return;
        this.center = center;
        let k = 4;
        for (let i = 0; i < this.thumbs.length; i++) {
            const thumb = this.thumbs[i];
            thumb.index = i;
            thumb.alpha = (i - center) / k;
        }
    }

    addThumb(thumb) {
        thumb.helix = this;
        this.thumbs.push(thumb);
        this.concentrate(this.center);
    }

    closeFrame() {
        if (!this.frame) return;
        if (this.frameOpened) {
            this.frame.object3D.remove(this.frame.name.object3D);
            this.frame.name = null;
        }

        this.frameOpened = false;
        this.frame.object3D.scale.y = 0;
    }

    openFrame() {
        if (!this.frame) return;
        this.frameOpened = true;
        this.frame.object3D.scale.y = 1;

        this.frame.name = this.thumbs[this.center].name;
        this.frame.name.object3D.position.z = .01;
        this.frame.name.object3D.position.y = - 0.45;
        this.frame.object3D.add(this.frame.name.object3D);
    }
}
