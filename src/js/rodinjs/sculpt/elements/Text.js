'use strict';

import {THREE} from '../../../vendor/three/THREE.GLOBAL.js';
import {RodinEvent} from '../../RodinEvent.js';
import {Sculpt} from './../Sculpt.js';
import {timeout} from './../../utils/timeout.js';
import {utils3D} from './../../utils/utils.js';
/**
 * Text Class, used to create flat text objects, parameters have the following structure:
 * <p>{</p>
 * <p>&nbsp; &nbsp;      text: string,</p>
 * <p>&nbsp; &nbsp;      color : hex,</p>
 * <p>&nbsp; &nbsp;      fontFamily : string,</p>
 * <p>&nbsp; &nbsp;      fontSize : number,</p>
 * <p>&nbsp; &nbsp;      fontStyle : string,</p>
 * <p>&nbsp; &nbsp;      transparent : boolean,</p>
 * <p>&nbsp; &nbsp;      ppm : number</p>
 * <p>}</p>
 *
 * ppm is the Pixel Per Meter resolution
 * @param {!Object}  - parameters
 */
export class Text extends Sculpt {
    constructor({
        background = {},
        text = "",
        color = 0x000000,
        fontFamily = "Arial",
        fontSize = 0.1,
        fontStyle = '',
        transparent = true,
        ppm = 500
        }) {
        super(0);
        this.background = background;
        this.text = text;
        this.color = color;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.fontStyle = fontStyle;
        this.transparent = transparent;
        this.ppm = ppm;
        this.texture = null;
        this.textMat = null;
        this.textMesh = null;
        this.canvas = document.createElement("canvas");
        this.draw();
        super.init(this.textMesh);
        timeout(() => {
            this.emit("ready", new RodinEvent(this));
        }, 0);
    };

    draw() {
        if (this.background.opacity === undefined && (this.background.color !== undefined || this.background.image !== undefined)) {
            this.background.opacity = 1;
        }
        let textSize = utils3D.measureTextOnCanvas(
            this.text,
            this.fontFamily,
            this.fontStyle,
            this.fontSize * this.ppm,
            this.canvas
        );
        this.canvas.width = textSize.x + 1;
        this.canvas.height = textSize.y;
        utils3D.drawTextOnCanvas({
            text: this.text,
            font: this.fontFamily,
            fontSize: this.fontSize * this.ppm,
            fontStyle: this.fontStyle,
            x: 0,
            y: 0,
            color: this.color,
            opacity: this.opacity,
            canvas: this.canvas
        });

        let w = utils3D.nearestPow2(this.canvas.width) / this.canvas.width;
        let h = utils3D.nearestPow2(this.canvas.height) / this.canvas.height;

        let inMemCanvas = document.createElement('canvas');
        let inMemCtx = inMemCanvas.getContext('2d');
        inMemCanvas.width = this.canvas.width * w;
        inMemCanvas.height = this.canvas.height * h;

        inMemCtx.drawImage(this.canvas, 0, 0, inMemCanvas.width, inMemCanvas.height);

        if(!this.texture){
            this.texture = new THREE.Texture(inMemCanvas);
        }
        else{
            this.texture.image = inMemCanvas;
        }
        if(!this.textMat){
            this.textMat = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: this.texture,
                transparent: this.transparent
            });
        }

        let geometry = new THREE.PlaneGeometry(1,1, 5, 5);
        geometry = utils3D.scaleGeometry(geometry, new THREE.Vector3(this.canvas.width / this.ppm, this.canvas.height / this.ppm, 1));
        if(!this.textMesh){
            this.textMesh = new THREE.Mesh(geometry, this.textMat);
        }else{
            this.textMesh.geometry.dispose();
            this.textMesh.geometry = geometry;
        }
        //this.textMesh.scale.set(this.canvas.width / this.ppm, this.canvas.height / this.ppm, 1);
        //this.textMesh.geometry.center();
        this.texture.needsUpdate = true;
        delete this.canvas;
        inMemCanvas = null;
    };

    reDraw({
        background = {},
        text = "",
        color = 0x000000,
        fontFamily = "Arial",
        fontSize = 0.1,
        transparent = true,
        ppm = 500
        }) {
        this.background = background;
        this.text = text;
        this.color = color;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.transparent = transparent;
        this.ppm = ppm;
        this.canvas = document.createElement("canvas");
        this.draw();
    }
}
