'use strict';

import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import {Event} from '../Event.js';
import {Sculpt} from '../sculpt/Sculpt.js';
import {timeout} from './timeout.js';

export class Carousel extends Sculpt{
    /**
     * Carousel Class
     * @param {size} carousel length
     * @param {elements} elements Array
     * @constructor
     */
    constructor ({
        size = 1,
        elements,
        angle = 0
        }) {
        super(0);

        this.size = size;
        this.elements = elements;
        this.angle = angle;
        this.circle = new THREE.Object3D();


        this.draw();
        super.init(this.circle);
        timeout(() => {
            this.emit("ready", new Event(this));
        }, 0);
    }

    draw(){
        if(this.circle.children && this.circle.children.length > 0){
            for (let i = this.circle.children.length-1; i >=0 ; i--) {
                let ch = this.circle.children[i];
                this.circle.remove(ch);
                ch = null;
            }
        }

        let step = 2 * Math.PI / this.elements.length;

        for (let i = 0; i < this.elements.length; i++) {
            let obj = this.elements[i].object3D;
            this.circle.add(obj);
            obj.position.z = this.size * Math.cos(this.angle + i * step);
            let x = this.size * Math.sin(this.angle + i * step);
            obj.position.x = x > 0 ? Math.min(x, this.size/2) :  Math.max(x, -this.size/2);
            //obj.position.x = Math.min(this.size/2, Math.min(-this.size/2, ))
        }
    }


}