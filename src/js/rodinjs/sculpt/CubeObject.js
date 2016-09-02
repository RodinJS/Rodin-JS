'use strict';

import {THREE} from '../../three/THREE.GLOBAL.js';
import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';

export class CubeObject extends Sculpt {
	constructor() {
		super();
		let textures = [];
	    for(let i = 0; i < 6; i ++) {
	        textures.push(new THREE.Texture());
	    }

	    this.SIDENAMES = {
		    FRONT: 'F',
		    BACK: 'B',
		    UP: 'U',
		    DOWN: 'D',
		    LEFT: 'L',
		    RIGHT: 'R'
		};

		this.Sides = {
		    order: [
		        this.SIDENAMES.FRONT,
		        this.SIDENAMES.BACK,
		        this.SIDENAMES.UP,
		        this.SIDENAMES.DOWN,
		        this.SIDENAMES.LEFT,
		        this.SIDENAMES.RIGHT
		    ],

		    configs: {
		        F: {
		            rotate: 0,
		            translate: [0, 0],
		            position: [0, 1]
		        },
		        B: {
		            rotate: 0,
		            translate: [0, 0],
		            position: [2, 1]
		        },
		        U: {
		            rotate: Math.PI,
		            translate: [-1, -1],
		            position: [1, 0]
		        },
		        D: {
		            rotate: Math.PI,
		            translate: [-1, -1],
		            position: [1, 2]
		        },
		        L: {
		            rotate: 0,
		            translate: [0, 0],
		            position: [3, 1]
		        },
		        R: {
		            rotate: 0,
		            translate: [0, 0],
		            position: [1, 1]
		        }
		    }
		}

	    let materials = [];

	    let imageObj = new Image();
	    imageObj.onload = () => {

	        for(let i = 0; i < this.Sides.order.length; i ++) {
	            let side = this.Sides.order[i];
	            materials.push(new THREE.MeshBasicMaterial({
	                map: createMaterial(this.Sides.configs[side], imageObj),
	                transparent: true
	            }));
	        }

	        let cube = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), new THREE.MeshFaceMaterial(materials));
	        cube.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));

	        super.init(cube);

	        return this.emit("ready", new Event(this));
	    };

	    imageObj.src = textureURL;
	}

    createMaterial(configs, imageObj) {
        let tileSize = imageObj.height / 3;
        let left = configs.position[0] * tileSize + 1;
        let top = configs.position[1] * tileSize + 1;
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        canvas.width = tileSize;
        canvas.height = tileSize;
        context.rotate(configs.rotate);
        context.translate(configs.translate[0] * tileSize, configs.translate[1] * tileSize);
        context.drawImage(imageObj, left, top, tileSize - 2, tileSize - 2, 0, 0, tileSize, tileSize);
        document.body.appendChild(canvas);
        let texture = new THREE.Texture();
        texture.image = canvas;
        texture.needsUpdate = true;
        return texture;
    }
}