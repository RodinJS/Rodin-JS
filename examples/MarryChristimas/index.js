import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

import {Snow} from '../../_build/js/rodinjs/sculpt/Snow.js';
import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';

import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {ViveController} from '../../_build/js/rodinjs/controllers/ViveController.js';

import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {EVENT_NAMES} from '../../_build/js/rodinjs/constants/constants.js'


let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let threeScene = scene.scene;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = false;

scene.setCameraProperty("far", 200);
//threeScene.fog = new THREE.Fog(0x7a8695, 0, 23);

/// mouse controller
let mouseController = new MouseController();
mouseController.onControllerUpdate = mouseControllerUpdate;
SceneManager.addController(mouseController);


/// Add light
//let light1 = new THREE.DirectionalLight(0xbbbbbb);
//light1.position.set(0, 3, 1);
//light1.castShadow = true;
//light1.shadow.camera.top = 15;
//light1.shadow.camera.bottom = -15;
//light1.shadow.camera.right = 15;
//light1.shadow.camera.left = -15;
//light1.shadow.mapSize.set(2048, 2048);
//scene.add(light1);

scene.add(new THREE.AmbientLight(0xaaaaaa, 0.5));


/*let boxSize = 30;
let snowBoxSize = 18;

// Add a skybox.
let skybox = new THREE.Mesh(new THREE.BoxGeometry(boxSize * 2, boxSize * 2, boxSize * 2), new THREE.MeshBasicMaterial({color: 0x000000}));
 skybox.position.y = controls.userHeight;
 skybox.scale.set(1, 1, -1);
 scene.add(skybox);

boxSize = 21;

// Add a snowContainer.
let snowContainer = new THREE.Object3D();
 snowContainer.rotation.y = -Math.PI / 2;
 snowContainer.position.y = -boxSize / 2 + snowBoxSize / 2;
 scene.add(snowContainer);

// Add snow
 let snow = new Snow(0,
 'img/particle_snow2.png',
 snowBoxSize,
 0.03,
 3,
 0.2,
 1
 );

 snow.on("ready", (evt) => {
 evt.target.object3D.renderOrder = 1;
 snowContainer.add(evt.target.object3D);
 });*/

// christmasRoom
let s = 0.026;
let christmasRoom = ModelLoader.load('./models/ChristmasRoom.JD');
christmasRoom.on('ready', () => {
    christmasRoom.object3D.children[0].material.materials[0].alphaTest = 0.35;
    christmasRoom.object3D.children[0].material.materials[0].transparent = false;
    christmasRoom.object3D.children[0].material.materials[0].side = THREE.DoubleSide;
    christmasRoom.object3D.children[0].material.materials[0].clipShadows = true;

    christmasRoom.object3D.scale.set(s, s, s);
    christmasRoom.object3D.position.z = 5;

    christmasRoom.object3D.castShadow = true;
    christmasRoom.object3D.receiveShadow = true;
    scene.add(christmasRoom.object3D);
});

let christmasFire = ModelLoader.load('./models/fire.JD');

christmasFire.on('ready', () => {
    let txt = new THREE.TextureLoader();
    txt.load(
        'models/fire.jpg',
        function (texture) {
            christmasFire.object3D.children[0].material.materials[0] = new THREE.MeshBasicMaterial({
                map: texture,
                skinning: true
            });
        },
    );
    christmasFire.object3D.scale.set(s, s, s);
    christmasFire.object3D.position.z = 5;

    christmasFire.object3D.castShadow = false;
    christmasFire.object3D.receiveShadow = false;
    scene.add(christmasFire.object3D);
});

let fireLight1 = new RODIN.THREEObject(new THREE.PointLight(0xff983c, 5, 1));
fireLight1.on('ready', (evt) => {
    fireLight1.object3D.position.set(0.2, 0.7, -5);
    scene.add(fireLight1.object3D);
});

let animations = [
    new Animation('light1', {
        intensity: 5
    }),
    new Animation('light2', {
        intensity: 4
    }),
    new Animation('light3', {
        intensity: 3
    }),
    new Animation('light4', {
        intensity: 6
    }),
    new Animation('light5', {
        intensity: 4.5
    })
];

for(let i = 0; i < animations.length; i ++) {
    animations[i].duration(200);
    fireLight1.animator.add(animations[i]);
}

fireLight1.animator.start('light1');
fireLight1.on(EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {
    let play = animations[Math.randomIntIn(0, animations.length - 1)].name;
    fireLight1.animator.start(play);
});

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