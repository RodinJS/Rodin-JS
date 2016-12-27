import {Element} from "../../../_build/js/rodinjs/sculpt/elements/Element.js";
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';

export class HoverableElement extends Element {
    constructor (params, paramsHover) {
        super(params);

        this.on('ready', () => {
            this.raycastable = true;

            this.hover = new Element(paramsHover);

            this.hover.on('ready', () => {
                this.hover.object3D.material.opacity = 0;
                this.object3D.add(this.hover.object3D);
            });
        });

        this.on(EVENT_NAMES.CONTROLLER_HOVER, () => {
            if(!this.hover) return;
            this.hover.object3D.material.opacity = 1;
            this.object3D.material.opacity = 0;
        });

        this.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
            if(!this.hover) return;
            this.hover.object3D.material.opacity = 0;
            this.object3D.material.opacity = 1;
        });
    }
}
