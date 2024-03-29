import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {MouseGamePad} from '../../_build/js/rodinjs/controllers/gamePads/MouseGamePad.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {Element} from '../../_build/js/rodinjs/sculpt/elements/Element.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {ANIMATION_TYPES} from '../../_build/js/rodinjs/constants/constants.js';

let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let mouseController = new MouseController();
let thumbsParentObject = new THREE.Object3D();
let state = {outOfBounds: true, numThumbs: 0};
let SQRT_HALF_ONE = Math.sqrt(0.5);

SceneManager.addController(mouseController);
scene.add(thumbsParentObject);
let buttons = MouseGamePad.getInstance().buttons;

mouseController.onValueChange = function(keyCode) {
    let direction = Math.sign(buttons[keyCode-1].value);
    state.outOfBounds = true;

    stopThumbs(direction);
    animateThumbs(direction);

    thumbsParentObject.children.forEach((thumb) => {
        if (!thumb.xPos) {
            state.outOfBounds = false;
        }
    });

    if (state.outOfBounds) {
        console.log(state.outOfBounds);
    }

    buttons[keyCode-1].value = 0;
};

function stopThumbs(direction) {
    thumbsParentObject.children.forEach((thumb) => {
        if (thumb.anim) {
            thumb.anim.stop();
            if (direction < 0 && thumb.endval < thumb.xPos || direction > 0 && thumb.endval > thumb.xPos) {
                thumb.position.x = thumb.endval;
                thumb.xPos = thumb.endval;
            }
        }
    });
}

function animateThumbs(direction) {
    thumbsParentObject.children.forEach((thumb) => {
        let elem = {
            x: thumb.position.x
        };
        let endval = 0;
        if (direction > 0) {
            endval = (thumb.xPos - 1) ; //  shift all thumbs to the left
        } else if (direction < 0) {
            endval = (thumb.xPos + 1) ; //  ... to the right
        }
        thumb.endval = endval;
        thumb.anim = new TWEEN.Tween(elem)
            .to({x: endval}, Math.abs(endval - elem.x)*500)
            .delay(0)
            .onUpdate(function() {
                thumb.Sculpt.setPosition(this.x);
            })
            .easing(TWEEN.Easing.Cubic.Out)
            .start()
            .onComplete(function() {
                thumb.xPos = thumb.position.x;
            });
    });
}

function loadThumbs(thumbsUrls) {
    let loadingState = { allThumbsReady : false };
    let thumbLoadingIndex = 0;
    state.numThumbs = thumbsUrls.length;
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
            thumb.setPosition = function(x) {
                let rootX = Math.sqrt(Math.abs(x));
                let z = rootX * 0.5;
                object.material.opacity = 1 - z;
                let angle = rootX * SQRT_HALF_ONE;
                this.object3D.position.set(x, 0, -z);
                this.object3D.rotation.y = x > 0 ? -angle : angle;
            };
            thumbsParentObject.add(object);
            RODIN.Raycastables.push(object);
            evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY, (evt) => {
                let targetObject3D = evt.target.object3D;
                if (targetObject3D.position.x === 0 || targetObject3D.material.opacity === 0) {
                    return;
                }
                stopThumbs(Math.sign(targetObject3D.position.x));
                animateThumbs(Math.sign(targetObject3D.position.x));
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


// function createHelixThumbs(loadingState) {
//     if (!loadingState.allThumbsReady) return;
//     let radius = 1;
//     let phiStep = 2 * Math.PI / 6;
//     let phi = Math.PI * 0.5;
//     let y = 1.5;
//     thumbsParentObject.children.forEach((thumb, index) => {
//         if (phi >= 2 * Math.PI + phiStep) {
//             phi = Math.PI * 0.5;
//             y -= 0.01;
//         }
//         thumb.position.set(radius * Math.cos(phi), y, -radius * Math.sin(phi));
//         thumb.rotation.y = Math.PI * 0.5 - Math.atan2(thumb.position.z, thumb.position.x);
//         phi += phiStep;
//         y -= 0.12;
//     });
//
//     scene.add(thumbsParentObject);
// }

let loadingState = loadThumbs([
    "./img/thumb1.jpg",
    "./img/thumb2.jpg",
    "./img/thumb3.jpg",
    "./img/thumb4.jpg",
    "./img/thumb5.jpg",
    "./img/thumb6.jpg",
    "./img/thumb7.jpg",
    "./img/thumb8.jpg",
    // "./img/thumb9.jpg",
    // "./img/thumb10.jpg",
    // "./img/thumb11.jpg",
    // "./img/thumb12.jpg",
    // "./img/thumb1.jpg",
    // "./img/thumb2.jpg",
    // "./img/thumb3.jpg",
    // "./img/thumb4.jpg",
    // "./img/thumb5.jpg",
    // "./img/thumb6.jpg",
    // "./img/thumb7.jpg",
    // "./img/thumb8.jpg",
    // "./img/thumb9.jpg",
    // "./img/thumb10.jpg",
    // "./img/thumb11.jpg",
    // "./img/thumb12.jpg",
    // "./img/thumb1.jpg",
    // "./img/thumb2.jpg",
    // "./img/thumb3.jpg",
    // "./img/thumb4.jpg",
    // "./img/thumb5.jpg",
    // "./img/thumb6.jpg",
    // "./img/thumb7.jpg",
    // "./img/thumb8.jpg",
    // "./img/thumb9.jpg",
    // "./img/thumb10.jpg",
    // "./img/thumb11.jpg",
    // "./img/thumb12.jpg"
]);

function createThumbs(loadingState) {
    if (!loadingState.allThumbsReady) return;
    for (let i = 0, length = thumbsParentObject.children.length; i < length; ++i) {
        let thumb = thumbsParentObject.children[i];
        let x = i - Math.floor(length/2);
        thumb.Sculpt.setPosition(x);
        thumb.xPos = x;
        // if (thumb.xPos != 0) {
        //     console.log(thumb);
        //     thumb.Sculpt.border.width = 0.0;
        //     thumb.Sculpt.border.opacity = 0.0;
        // }
    }
    thumbsParentObject.position.set(0, 1.5, -1);
}

createThumbs(loadingState);

// update TWEEN before start rendering
scene.preRender(function () {
    TWEEN.update();
});
