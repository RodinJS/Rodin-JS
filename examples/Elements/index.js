import * as RODIN from '../../_build/js/rodinjs/RODIN.js';

console.log(RODIN);

import '../../_build/js/vendor/three/examples/js/controls/VRControls.js';
import '../../_build/js/vendor/three/examples/js/effects/VREffect.js';
import '../../_build/js/vendor/three/examples/js/WebVR.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {Element} from '../../_build/js/rodinjs/sculpt/elements/Element.js';
import '../../_build/js/rodinjs/utils/Math.js';

RODIN.WTF.is('Rodin.JS v0.0.1');

/////////////////////////////WebVR Example/////////////////////////////////////

// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000 );

scene.add(camera);

// scene.add(target)

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);
controls.standing = true;

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
var managerParams = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};

var manager = new WebVRManager(renderer, effect, managerParams);

var raycaster;

// controllers
var controller = new RODIN.MouseController();
controller.setRaycasterScene(scene);
controller.setRaycasterCamera(camera);
controller.onKeyDown = controllerKeyDown;
controller.onKeyUp = controllerKeyUp;
controller.onControllerUpdate = controllerUpdate;



function controllerUpdate() {
}

function controllerKeyDown(keyCode) {
}

function controllerKeyUp(keyCode) {
}
raycaster = new RODIN.Raycaster( scene );



let i = 50;
while(i--){
    let r = Math.randomIntIn(1, 3);
    let params = {};
    params.name ="name_";
    params.width = 0.8;
    params.height = 0.8;
    params.background = {
        color: 0xaaaaaa,
        opacity: 0.2
        //image: {
        //    url: "./img/test.jpg"
        //}
    };
    params.border = {
        width: 0.01,
        color: 0xff8800,
        opacity: 1,
        radius: 0.3
    };
    params.label = {
        text: "Rodin "+i,
        fontFamily: "Arial",
        fontSize: 0.11,
        color:0xffffff,
        opacity:1,
        position: {h: 50, v: 80}
    };
    params.image = {
        url: "./img/rodin.png",
        width: 0.3,
        height: 0.4,
        opacity: 1,
        position: {h: 50, v: 43}
    };

    let button = new Element(params);
    button.on('ready', (evt) => {
        let object = evt.target.object3D;
        //object.position.z = -1;
        //object.position.y = 1.6;
        object.position.x = Math.randomFloatIn(-5.3, 5.3);
        object.position.y = Math.randomFloatIn(-5.3, 5.3);
        object.position.z = Math.randomFloatIn(-5.3, 5.3);

        object.castShadow = true;
        object.receiveShadow = true;
        scene.add(object);
        RODIN.Raycastables.push(object);
        evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            //console.log(evt);
            if (evt.controller instanceof RODIN.ViveController) {
            }
            else if (evt.controller instanceof RODIN.MouseController) {
                evt.target.animate(
                    {
                        property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
                        to : new THREE.Vector3(1.1, 1.1, 1.1)
                    }
                );
                //evt.target.object3D.scale.set(1.1, 1.1, 1.1);
            }
        });
        evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            if (evt.controller instanceof RODIN.ViveController) {
            }
            else if (evt.controller instanceof RODIN.MouseController) {
                //console.log(evt.target.object3D);
                evt.target.animate(
                    {
                        property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
                        to : new THREE.Vector3(1, 1, 1)
                    }
                );
            }
        });
    });
    button.on('update', (evt) =>{
        evt.target.object3D.rotation.y += 0.01*r;
    });

}

// Kick off animation loop
requestAnimationFrame(animate);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

// Request animation frame loop function
function animate(timestamp) {


    // Update controller.
    controller.update();
    //if(button.object3D)button.object3D.rotation.y +=0.01;
    RODIN.Objects.map( obj => obj.emit('update', new RODIN.Event(obj)));
    // Update VR headset position and apply to camera.
    controls.update();

    if(TWEEN){
        TWEEN.update();
    }

    // Render the scene through the manager.
    manager.render(scene, camera, timestamp);

    requestAnimationFrame(animate);
}

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

////////////////////////////////////////////////////////////////////////////////////////////////
