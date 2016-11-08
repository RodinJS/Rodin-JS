'use strict';

import {THREE} from '../../three/THREE.GLOBAL.js';
import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';

export class CubeObject extends Sculpt {
    constructor(size, textureURL) {
        super();
        let textures = [];
        for (let i = 0; i < 6; i++) {
            textures.push(new THREE.Texture());
        }

        let materials = [];

        let imageObj = new Image();
        imageObj.onload = () => {

            for (let i = 0; i < CubeObject.Sides.order.length; i++) {
                let side = CubeObject.Sides.order[i];
                materials.push(new THREE.MeshBasicMaterial({
                    map: this.createMaterial(CubeObject.Sides.configs[side], imageObj)
                }));
            }

            let cube = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), new THREE.MeshFaceMaterial(materials));
            cube.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));

            super.init(cube);

            return this.emit("ready", new Event(this));
        };

        imageObj.src = textureURL;
    }

    static SIDENAMES = {
        FRONT: 'F',
        BACK: 'B',
        UP: 'U',
        DOWN: 'D',
        LEFT: 'L',
        RIGHT: 'R'
    };

    static Sides = {
        order: [
            CubeObject.SIDENAMES.FRONT,
            CubeObject.SIDENAMES.BACK,
            CubeObject.SIDENAMES.UP,
            CubeObject.SIDENAMES.DOWN,
            CubeObject.SIDENAMES.LEFT,
            CubeObject.SIDENAMES.RIGHT
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
    };

    createMaterial(configs, imageObj) {
        let tileSize = imageObj.height / 3;
        let left = configs.position[0] * tileSize + 1;
        let top = configs.position[1] * tileSize + 1;
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        canvas.width = tileSize;
        canvas.height = tileSize;


        canvas.style.position = "absolute";
        canvas.style.left = "-150%";
        canvas.style.top = "-150%";

        context.rotate(configs.rotate);
        context.translate(configs.translate[0] * tileSize, configs.translate[1] * tileSize);
        context.drawImage(imageObj, left, top, tileSize - 2, tileSize - 2, 0, 0, tileSize, tileSize);

        let texture = new THREE.Texture();
        texture.image = canvas;
        texture.needsUpdate = true;
        return texture;
    }
}