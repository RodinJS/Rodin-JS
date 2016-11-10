import {THREE} from '../../three/THREE.GLOBAL.js';

export const _canvas = document.createElement('canvas');

/**
 *
 * @param { THREE.Object3D } object
 * @param { THREE.Object3D } targetParent
 */
export function createGeometryFromShape(  shape ) {

    let geometry = new THREE.ShapeGeometry(shape);
    geometry.center();
    return geometry;

}

export function createShape(  shape = null, material = null ) {

    let geometry = new THREE.ShapeGeometry(shape);
    geometry.center();
    return new THREE.Mesh(geometry, material);

}

export function pill(ctx, width, radius) {
    width = width - 2 * radius;

    ctx.moveTo(radius, 0);

    ctx.lineTo(radius + width, 0);

    ctx.absarc(radius + width, radius, radius, -Math.PI / 2, Math.PI / 2, true);

    ctx.lineTo(radius, 2 * radius);

    ctx.absarc(radius, radius, radius, Math.PI / 2, 3 * Math.PI / 2, true);
}


export function roundRect(ctx, width, height, radius) {

    radius = radius > width/2 ? width/2 : radius;
    radius = radius > height/2 ? height/2 : radius;

    width = width - 2 * radius;
    height = height - 2 * radius;

    ctx.moveTo(radius, 0);

    ctx.lineTo(radius + width, 0);

    ctx.quadraticCurveTo(2*radius + width, 0, 2*radius + width, radius);

    ctx.lineTo(2*radius + width, radius + height);

    ctx.quadraticCurveTo(2*radius + width, 2*radius + height, radius + width, 2*radius + height);

    ctx.lineTo(radius, 2*radius + height);

    ctx.quadraticCurveTo(0, 2*radius + height, 0, radius + height);

    ctx.lineTo(0, radius);

    ctx.quadraticCurveTo(0, 0, radius, 0);
}

export function createTextTexture(text, font, fontSize, color, clear, textCanvas = _canvas) {
    let textContext = textCanvas.getContext('2d');
    clear && textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
    let rgb = hexToRgb(color);
    fontSize*=100;
    textContext.font = fontSize + "px " + font;
    textCanvas.width = textContext.measureText(text).width;
    textCanvas.height = fontSize;
    textContext.font = fontSize + "px " + font;
    textContext.fillStyle = "rgb("+rgb.r+", "+rgb.g+", "+rgb.b+")";
    textContext.fillText(text, 0, fontSize, textCanvas.width);
    return new THREE.Texture(textCanvas);
};

export function setupCanvas({width = 0, height = 0, canvas = _canvas} = {}) {
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = width;
    canvas.height = height;
    return canvas;
};

export function measureTextOnCanvas(text, font, fontSize, canvas = _canvas) {
    let textContext = canvas.getContext('2d');
    textContext.font = fontSize + "px " + font;
    return {x: textContext.measureText(text).width, y: fontSize};
};
export function drawImageOnCanvas({image, width = _canvas.width, height = _canvas.height, x=0, y=0, canvas = _canvas}) {
    let context = canvas.getContext('2d');
    context.drawImage(image, x, y, width, height);
    return canvas;
};

export function drawTextOnCanvas({text, font = "Arial", fontSize = 12, x = 0, y = 0, color = 0x000000, opacity = 1, textCanvas = _canvas}) {
    let textContext = textCanvas.getContext('2d');
    let rgb = hexToRgb(color);
    textContext.font = fontSize + "px " + font;
    textContext.fillStyle = "rgba("+rgb.r+", "+rgb.g+", "+rgb.b+", "+opacity+")";
    textContext.fillText(text, x, y+fontSize);
    return textCanvas;
};

export function hexToRgb(hex) {
    return {
        r: (hex >> 16) & 0xFF,        // or `(i & 0xFF0000) >> 16`
        g: (hex >> 8) & 0xFF,        // or `(i & 0x00FF00) >>  8`
        b: hex & 0xFF
    };
};
