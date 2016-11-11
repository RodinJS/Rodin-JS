'use strict';

import {THREE} from '../../../three/THREE.GLOBAL.js';
import {Event} from '../../Event.js';
import {Sculpt} from './../Sculpt.js';
import {timeout} from './../../utils/timeout.js';
import {utils3D} from './../../utils/utils.js';

export class Button extends Sculpt {
    constructor({
        name = "button",
        width = 0.2,
        height = 0.15,
        background = {},
        border = {},
        label = {},
        image,
        ppm = 2000
        }) {
        super(0);
        this.name = name;
        this.width = width;
        this.height = height;
        this.background = background;
        this.border = border;
        this.label = label;
        this.image = image;
        this.ppm = ppm;
        if(this.background.opacity === undefined && (this.background.color || this.background.image)){
            this.background.opacity = 1;
        }
        if(this.border === undefined || this.border.radius === undefined ){
            this.border.radius = 0.00000001;
        }
        if(this.label !== undefined && this.label.fontSize === undefined ){
            this.label.fontSize = Math.min(this.height, this.width)/4;
        }
        if(this.image !== undefined && this.image.url === undefined ){
            this.image = null;
        }
        const checkImageLoad = () => {
            if (this.image && !this.image.loaded) return false;
            if (this.background.image && !this.background.image.loaded) return false;
            return true;
        };
        const draw = () => {
            if (!checkImageLoad()) return;
            let buttonShape = new THREE.Shape();
            utils3D.roundRect(buttonShape, this.width, this.height, this.border.radius);
            let buttonGeo = utils3D.createGeometryFromShape(buttonShape);

            let canvas = utils3D.setupCanvas({width: this.ppm * this.width, height: this.ppm * this.height});
            // Background
            /*            let buttonBGMat = new THREE.MeshBasicMaterial({
             color: this.background.color ? this.background.color : 0xffffff,
             transparent: !isNaN(parseFloat(this.background.opacity)),
             opacity: this.background.opacity,
             side:THREE.DoubleSide
             });
             if(this.background.image){
             let tex = this.background.image.texture;
             tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
             tex.repeat.set(1/this.width, 1/this.height);
             buttonBGMat.map = tex;
             }*/
            if (this.background.image) {
                utils3D.drawImageOnCanvas({
                    image: this.background.image.element,
                    opacity: this.background.opacity,
                    canvas
                });
                /*
                 document.body.appendChild(canvas);
                 canvas.style.zIndex = 9999999999;
                 canvas.style.position = "absolute";
                 canvas.style.top = "0";
                 canvas.style.left = "0";
                 */
            } else if (this.background.color) {
                let ctx = canvas.getContext("2d");
                let rgb = utils3D.hexToRgb(this.background.color);
                ctx.fillStyle = "rgba("
                    + rgb.r + ", "
                    + rgb.g + ", "
                    + rgb.b + ", "
                    + this.background.opacity
                    + ")";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // label
            if (this.label) {
                let x = 0;
                let y = 0;
                if (this.label.position && this.label.position.h) {
                    x = this.label.position.h * (this.ppm * this.width) / 100;
                }
                if (this.label.position && this.label.position.v) {
                    y = this.label.position.v * (this.ppm * this.height) / 100;
                }
                utils3D.drawTextOnCanvas({
                    text: this.label.text,
                    font: this.label.fontFamily,
                    fontSize: this.label.fontSize * this.ppm,
                    x,
                    y,
                    color: this.label.color,
                    opacity: this.label.opacity,
                    canvas
                });
            }

            // image
            if (this.image) {
                let x = 0;
                let y = 0;
                if (this.image.position && this.image.position.h) {
                    x = this.image.position.h * (this.ppm * this.width) / 100;
                }
                if (this.image.position && this.image.position.v) {
                    y = this.image.position.v * (this.ppm * this.height) / 100;
                }
                let canvas = utils3D.drawImageOnCanvas({
                    image: this.image.element,
                    width: this.ppm * this.image.width,
                    height: this.ppm * this.image.height,
                    x,
                    y,
                    opacity: this.image.opacity,
                    canvas
                });
                /*                document.body.appendChild(canvas);
                 canvas.style.zIndex = 9999999999;
                 canvas.style.position = "absolute";
                 canvas.style.top = "0";
                 canvas.style.left = "0";*/
            }

            let buttonMat = null;
            if (this.image || this.label) {
                let tex = new THREE.Texture(canvas);
                tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
                tex.repeat.set(1 / this.width, 1 / this.height);
                buttonMat = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    map: tex,
                    transparent: true
                });
                tex.needsUpdate = true;
            }


            // Mesh
            let buttonMesh = null;
            if (buttonMat) {
                buttonMesh = new THREE.Mesh(buttonGeo, buttonMat);
            }


            // Finalizing
            super.init(buttonMesh);
            timeout(() => {
                this.emit("ready", new Event(this));
            }, 0);
            //console.log(this)
        };

        draw();
        let textureLoader = new THREE.TextureLoader();
        if (this.image) {
            let img = document.createElement("img");
            img.onload = () => {
                this.image.loaded = true;
                this.image.element = img;
                draw();
            };
            img.src = this.image.url;
        }
        if (this.background.image) {
            let img = document.createElement("img");
            img.onload = () => {
                this.background.image.loaded = true;
                this.background.image.element = img;
                draw();
            };
            img.src = this.background.image.url;
        }

    }


/*    createMaterial(configs, imageObj) {
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
    }*/
}