import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {MouseGamePad} from '../../_build/js/rodinjs/controllers/gamePads/MouseGamePad.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {Element} from '../../_build/js/rodinjs/sculpt/elements/Element.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
//import {Animation} from '../../_build/js/rodinjs/sculpt/CubeObject.js';

let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let mouseController = new MouseController();
let thumbsParentObject = new THREE.Object3D();
let visibleThumbsCount = 7;

SceneManager.addController(mouseController);
scene.add(thumbsParentObject);

// let scroll = MouseGamePad.getInstance().buttons[1];
// let angle = 0;
// mouseController.onControllerUpdate = controllerUpdate;
// function controllerUpdate() {
//     if (scroll.value > 0) {
//         angle -= 0.05;
//     } else if (scroll.value < 0) {
//         angle += 0.05;
//     } else {
//
//     }
//     container.rotation.y = angle;
// }

function loadThumbs(thumbsUrls) {
    let loadingState = { allThumbsReady : false };

    let thumbLoadingIndex = 0;
    thumbsUrls.forEach((thumbUrl) => {
        let params = {};
        params.name = "name_";
        params.width = 0.9;
        params.height = 0.6;
        params.border = {
            width: 0.01,
            color: 0x777777,
            opacity: 1,
            radius: 0.025
        };
        params.image = {
            url: thumbUrl,
            width: 0.9,
            height: 0.6,
            opacity: 1,
            position: {h: 50, v: 50}
        };
        let thumb = new Element(params);

        thumb.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.castShadow = true;
            object.receiveShadow = true;
            object.setPosition = function(x, opacity) {
                let y = 1.5;
                this.position.set(x, y, -Math.sqrt(x));
                this.rotation.y = Math.sqrt(x);
            };

            thumbsParentObject.add(object);
            RODIN.Raycastables.push(object);

            evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY, (evt) => {
                //console.log(evt);
            });
            evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
                evt.target.animate(
                    {
                        property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
                        to: new THREE.Vector3(1.1, 1.1, 1.1)
                    }
                );
            });
            evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
                evt.target.animate(
                    {
                        property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
                        to: new THREE.Vector3(1, 1, 1)
                    }
                );
            });
            loadingState.allThumbsReady = thumbLoadingIndex++ == thumbsUrls.length - 1;
            createThumbs(loadingState);
        });

    });
    return loadingState;
}

function createHelixThumbs(loadingState) {
    if (!loadingState.allThumbsReady) return;
    let radius = 1;
    let phiStep = 2 * Math.PI / 6;
    let phi = Math.PI * 0.5;
    let y = 1.5;
    thumbsParentObject.children.forEach((thumb, index) => {
        if (phi >= 2 * Math.PI + phiStep) {
            phi = Math.PI * 0.5;
            y -= 0.01;
        }
        thumb.position.set(radius * Math.cos(phi), y, -radius * Math.sin(phi));
        thumb.rotation.y = Math.PI * 0.5 - Math.atan2(thumb.position.z, thumb.position.x);
        phi += phiStep;
        y -= 0.12;
    });
    scene.add(thumbsParentObject);
}

/*
function createSqrtThumbs(loadingState) {
    if (!loadingState.allThumbsReady) return;
    let angle = 0;
    let angleStep = 0.5;
    let x = 1; let y = 1.5;
    let xStep = 0.8;
    let getZ = (x) => {
        return Math.sqrt(x);
    };
    for (let i = 0; i < 3; ++i) {
        let thumb = thumbsParentObject.children[i];
        thumb.position.set(x, y, -getZ(x));
        thumb.rotation.y = angle;
        x += xStep;
        angle -= angleStep;
    }
    x = 1;
    angle = 0;
    for (let i = 3; i < 3 + 3; ++i) {
        let thumb = thumbsParentObject.children[i];
        thumb.position.set(-x, y, -getZ(x));
        thumb.rotation.y = -angle;
        x += xStep;
        angle -= angleStep;
    }
    let centerThumb = thumbsParentObject.children[6];
    centerThumb.position.set(0, y, -0.7);
}
*/

let loadingState = loadThumbs([
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
    "./img/thumb12.jpg"
]);

function createThumbs(loadingState) {
    if (!loadingState.allThumbsReady) return;

    let x = 1;
    let xStep = 0.8;

    for (let i = 0; i < Math.floor(visibleThumbsCount/2); ++i) {
        let thumb = thumbsParentObject.children[i];
        thumb.setPosition(x);
        x += xStep;
    }
}

createThumbs(loadingState);

// update TWEEN before start rendering
scene.preRender(function () {
    TWEEN.update();
});
