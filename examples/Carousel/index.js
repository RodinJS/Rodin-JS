import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {ViveController} from '../../_build/js/rodinjs/controllers/ViveController.js';
import {changeParent}  from '../../_build/js/rodinjs/utils/ChangeParent.js';
import {timeout} from '../../_build/js/rodinjs/utils/timeout.js';
import {Interval} from '../../_build/js/rodinjs/utils/interval.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {Element} from '../../_build/js/rodinjs/sculpt/elements/Element.js';
import {Text} from '../../_build/js/rodinjs/sculpt/elements/Text.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';
import {Carousel} from '../../_build/js/rodinjs/utils/Carousel.js';


let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let threeScene = scene.scene;


let imageCount = 15;
let readyImages = 0;
let images = [];
let carousel = null;
let readyCheck = () => {
    if(readyImages === imageCount){
        carousel = new Carousel({size: 1, elements: images});
        carousel.on("ready", (evt) => {
            scene.add(carousel.object3D);
            carousel.object3D.position.z = -1.5;
            carousel.object3D.position.y = controls.userHeight;
        });
        carousel.on("update", (evt) => {
            evt.target.angle += 0.005;
            evt.target.draw();
        });
    }
};

renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = false;


scene.setCameraProperty("far", 200);


/// mouse controller

let mouseController = new MouseController();
mouseController.onControllerUpdate = mouseControllerUpdate;
SceneManager.addController(mouseController);


/// vive controllers

let controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, threeScene, null, 1);
controllerL.standingMatrix = controls.getStandingMatrix();

controllerL.onKeyDown = controllerKeyDown;
controllerL.onKeyUp = controllerKeyUp;
controllerL.onTouchUp = controllerTouchUp;
controllerL.onTouchDown = controllerTouchDown;

SceneManager.addController(controllerL);

scene.add(controllerL);

let controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, threeScene, null, 1);
controllerR.standingMatrix = controls.getStandingMatrix();

controllerR.onKeyDown = controllerKeyDown;
controllerR.onKeyUp = controllerKeyUp;
controllerR.onTouchUp = controllerTouchUp;
controllerR.onTouchDown = controllerTouchDown;

SceneManager.addController(controllerR);

scene.add(controllerR);

let loader = new THREE.OBJLoader();
loader.setPath('./models/');
loader.load('vr_controller_vive_1_5.obj', function (object) {

    let loader = new THREE.TextureLoader();
    loader.setPath('./img/');

    object.children[0].material.map = loader.load('onepointfive_texture.png');
    object.children[0].material.specularMap = loader.load('onepointfive_spec.png');

    controllerL.add(object.clone());
    controllerR.add(object.clone());
});

scene.add(new THREE.AmbientLight(0xaaaaaa));

/*let objReady = function (object) {
    let obj = new RODIN.THREEObject(object);
    RODIN.Raycastables.push(obj.object3D);
    obj.object3D.initialParent = obj.object3D.parent;

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
        let controller = evt.controller;
        let target = evt.target;
        if (controller instanceof ViveController) {
        }
        if (controller instanceof MouseController) {
        }
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
        let controller = evt.controller;
        let target = evt.target;
        if (controller instanceof ViveController) {
        }
        if (controller instanceof MouseController) {
        }
    });

    // CONTROLLER_KEY
    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
        let controller = evt.controller;
        let target = evt.target;
        if (controller instanceof ViveController) {
        }
        if (controller instanceof MouseController) {
        }
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
        let controller = evt.controller;
        let target = evt.target;
        if (controller instanceof ViveController) {
        }
        if (controller instanceof MouseController) {
        }
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_VALUE_CHANGE, (evt) => {


        let controller = evt.controller;
        let target = evt.target;
        if (controller instanceof MouseController) {
            let gamePad = MouseController.getGamepad();
            if (evt.keyCode === 2) {
                let initParent = target.object3D.parent;
                changeParent(target.object3D, camera);
                target.object3D.position.z -= gamePad.buttons[evt.keyCode - 1].value / 1000;
                gamePad.buttons[evt.keyCode - 1].value = 0;
                changeParent(target.object3D, initParent);
            }
        }


    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK, (evt) => {
        if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY1) {
        }
        if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) {
        }
    });

    // Controller touch
    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_START, (evt) => {
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_END, (evt) => {
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TAP, (evt) => {
    });
};*/


function controllerKeyDown(keyCode) {
    if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }
}

function controllerKeyUp(keyCode) {
    if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
    this.engaged = false;
    if (this.pickedItems && this.pickedItems.length > 0) {
        this.pickedItems = [];
    }
}

function controllerTouchDown(keyCode, gamepad) {
}

function controllerTouchUp(keyCode, gamepad) {

}

function mouseControllerUpdate() {
    this.raycaster.setFromCamera({x: this.axes[0], y: this.axes[1]}, camera);

    if (this.pickedItems && this.pickedItems.length > 0) {
        this.pickedItems.map(item => {
            if (this.raycaster.ray.intersectPlane(item.raycastCameraPlane, item.intersection)) {
                if (this.keyCode === 1) {
                    let initParent = item.parent;
                    changeParent(item, threeScene);
                    item.position.copy(item.intersection.sub(item.offset));
                    changeParent(item, initParent);
                } else if (this.keyCode === 3) {
                    let shift = {x: this.axes[0] - item.initMousePos.x, y: this.axes[1] - item.initMousePos.y};
                    item.initMousePos = {x: this.axes[0], y: this.axes[1]};
                    let initParent = item.parent;
                    changeParent(item, camera);
                    let deltaRotationQuaternion = new THREE.Quaternion()
                        .setFromEuler(
                            new THREE.Euler(-shift.y * Math.PI, shift.x * Math.PI, 0, 'XYZ')
                        );
                    item.quaternion.multiplyQuaternions(deltaRotationQuaternion, item.quaternion);

                    changeParent(item, initParent);
                }
            }
        });
    }
}

for (let i = 0; i < imageCount; i++) {
    let params = {name: "image " + i, width: 0.4, height: 0.3, transparent: false};

    params.background = {
        image: {
            url: "./img/test.jpg"
        }
    };
    params.border = {
        radius: 0.03
    };


    let image = new Element(params);

    image.on('ready', (evt) => {
        RODIN.Raycastables.push(evt.target.object3D);
        //evt.target.animator.add(hoverAnimation, hoverOutAnimation, scaleOutAnimation, scaleInAnimation);
        readyImages++;
        images.push(evt.target);
        readyCheck();
    });

    image.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
    });

    image.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
    });

    image.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
    });

    image.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
    });

    image.on(RODIN.CONSTANTS.EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {

    });
}

