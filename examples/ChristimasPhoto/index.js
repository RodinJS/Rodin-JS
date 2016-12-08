import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {Snow} from '../../_build/js/rodinjs/sculpt/Snow.js';
import {JSONModelObject} from '../../_build/js/rodinjs/sculpt/JSONModelObject.js';
import {JDModelObject} from '../../_build/js/rodinjs/sculpt/JDModelObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';


let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let threeScene = scene.scene;


renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = false;

scene.setCameraProperty("far", 200);

threeScene.fog = new THREE.Fog(0x7a8695, 0, 23);

/// mouse controller

let mouseController = new MouseController();
mouseController.onControllerUpdate = mouseControllerUpdate;
SceneManager.addController(mouseController);


/// Add light
let light1 = new THREE.DirectionalLight(0xbbbbbb);
light1.position.set(0, 6, 1);
light1.castShadow = true;
light1.shadow.camera.top = 15;
light1.shadow.camera.bottom = -15;
light1.shadow.camera.right = 15;
light1.shadow.camera.left = -15;
light1.shadow.mapSize.set(2048, 2048);
scene.add(light1);

scene.add(new THREE.AmbientLight(0xaaaaaa));


let boxSize = 30;
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

/// Add snow
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
});


/// Add terrain
let terrain = new JSONModelObject(0, "./models/terrain.json");
terrain.on('ready', () => {
    let textureSnow = new THREE.TextureLoader().load("./models/snow_texture.jpg");
    textureSnow.wrapS = THREE.RepeatWrapping;
    textureSnow.wrapT = THREE.RepeatWrapping;
    textureSnow.repeat.x = 15;
    textureSnow.repeat.y = 15;
    let mesh = new THREE.Mesh(terrain.object3D.geometry,
        new THREE.MeshLambertMaterial({
            color: 0xbbbbbb,
            map: textureSnow,
            clipShadows: true
        }));

    mesh.scale.set(0.3, 0.4, 0.3);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
});


// christmasTree
let s = 0.05;
let christmasTree = new JDModelObject(0, './models/ChristmasTree.JD');
christmasTree.on('ready', () => {
    /*christmasTree.object3D.material.materials[0].alphaTest = 0.35;
    christmasTree.object3D.material.materials[0].transparent = false;
    christmasTree.object3D.material.materials[0].side = THREE.DoubleSide;
    christmasTree.object3D.material.materials[0].clipShadows = true;*/

    christmasTree.object3D.scale.set(s+0.02, s+0.02, s+0.02);
    christmasTree.object3D.position.x = 1;
    christmasTree.object3D.position.y = 0;
    christmasTree.object3D.position.z = -3;

    /*christmasTree.object3D.castShadow = true;
    christmasTree.object3D.receiveShadow = true;*/
    scene.add(christmasTree.object3D);
});
// random tree
let tree = new JSONModelObject(0, './models/tree.json');
tree.on('ready', () => {
    for (let i = 0; i < 15; i++) {
        let s = Math.randomFloatIn(0.05, 0.15);
        let t = tree.object3D.clone();
        let alpha = Math.randomFloatIn(-Math.PI, Math.PI);

        t.position.x = (Math.sin(alpha) + s) * Math.randomFloatIn(5, 15);
        t.position.y = 0;
        t.position.z = (Math.cos(alpha) + s) * Math.randomFloatIn(5, 15);
        t.rotation.y = (Math.random() - 0.5) * 2 * Math.PI / 2;
        t.scale.set(s, s, s);

        t.castShadow = true;
        t.receiveShadow = true;
        scene.add(t);
    }
});


// christmasTree toys
/*
let toyURLS = [
    './models/bell.json',
    './models/candy.json',
    './models/toyDuploCone.json',
    './models/toySphereBig.json',
    './models/toySphereMiddle.json',
    './models/toySphereSmall.json',
    './models/star.json',
];
let toyReady = function () {
    let obj = new RODIN.THREEObject(this.object3D);
    let k = Math.randomFloatIn(-0.1, -1.0);
    let alpha = Math.randomFloatIn(-Math.PI, Math.PI);

    obj.object3D.position.x = (Math.sin(alpha) + s) * k;
    obj.object3D.position.y = s;
    obj.object3D.position.z = (Math.cos(alpha) + s) * k;
    obj.object3D.rotation.y = (Math.random() - 0.5) * 2 * Math.PI / 2;
    obj.object3D.scale.set(s, s, s);

    obj.object3D.castShadow = true;
    obj.object3D.receiveShadow = true;

    scene.add(obj.object3D);
    RODIN.Raycastables.push(obj.object3D);
    obj.object3D.initialParent = obj.object3D.parent;

};
let colors = [0x0d2a70, 0x690000, 0xd2d2d2];
for (let i = 0; i < 10; i++) {
    let url = toyURLS[Math.randomIntIn(0, 5)];
    let toy = new JSONModelObject(i, url);

    toy.on('ready', toyReady);
    toy.on('ready', () => {
            toy.object3D.geometry.computeVertexNormals();

            toy.object3D.material.materials[0].reflectivity = 1;
            toy.object3D.material.materials[0].hue = 1;
            if (url !== toyURLS[1]) {
                toy.object3D.material.materials[0].color = new THREE.Color(colors[Math.randomIntIn(0, colors.length - 1)]);
            }
        }
    )
}

let toy = new JSONModelObject(10, toyURLS[6]);
toy.on('ready', toyReady);
toy.on('ready', () => {
    toy.object3D.geometry.center();
    let toyGeo = toy.object3D.geometry.clone();
    let glowMat = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load("./models/star.png"),
        lights: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.75,
        transparent: true
    });
    let toyGlow = new THREE.Mesh(toyGeo, glowMat);
    toyGlow.scale.multiplyScalar(1.5);
    toyGlow.geometry.center();
    toy.object3D.add(toyGlow);
    console.log(toyGlow);
});
*/


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
