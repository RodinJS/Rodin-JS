import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';

export class Helix extends RODIN.THREEObject {
    constructor () {
        super(new THREE.Object3D());
        this.thumbs = [];
        this.center = 0;

        this.on('ready', () => {
            this.concentrate(0);
        })
    }

    concentrate (center = 0) {
        if (center < 0 || center > this.thumbs.length - 1) return;
        this.center = center;
        let k = 4;
        for (let i = 0; i < this.thumbs.length; i++) {
            const thumb = this.thumbs[i];
            thumb.index = i;
            thumb.alpha = (i - center) / k;
        }
    }

    addThumb (thumb) {
        thumb.helix = this;
        this.thumbs.push(thumb);
        this.concentrate(this.center);
    }
}
