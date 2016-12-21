import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {Snow} from '../../_build/js/rodinjs/sculpt/Snow.js';
import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {EVENT_NAMES} from '../../_build/js/rodinjs/constants/constants.js'


let scene = SceneManager.get();
let controls = scene.controls;
let renderer = scene.renderer;
let threeScene = scene.scene;

renderer.setPixelRatio(window.devicePixelRatio);

scene.setCameraProperty("far", 150);

threeScene.fog = new THREE.Fog(0x7a8695, 0, 18);

/// Add light
let light1 = new THREE.DirectionalLight(0xcccccc, 1);
light1.position.set(4, 5, 4);
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
    0.025,
    3,
    0.2,
    1
);
snow.on("ready", (evt) => {
    evt.target.object3D.renderOrder = 1;
    snowContainer.add(evt.target.object3D);
});

// add Christmas Tree Scene
let christmasTreeScene = ModelLoader.load("./models/ChristmasTreeScene.obj");
christmasTreeScene.on('ready', () => {
    scene.add(christmasTreeScene.object3D);
});

// add point light on tree
let pointLightOnTree = ModelLoader.load("./models/pointLight.JD");
pointLightOnTree.on('ready', () => {
    createPointLights(pointLightOnTree);
});

let animationsPointLight = [
    new Animation('light1', {
        scale: {x: 0.04, y: 0.04, z: 0.04}
    }),
    new Animation('light2', {
        scale: {x: 0.08, y: 0.08, z: 0.08}
    }),
    new Animation('light3', {
        scale: {x: 0.12, y: 0.12, z: 0.12}
    }),
    new Animation('light4', {
        scale: {x: 0.06, y: 0.06, z: 0.06}
    }),
    new Animation('light5', {
        scale: {x: 0.1, y: 0.1, z: 0.1}
    })
];

function createPointLights(model) {
    let createPointLightsLength = model.object3D.children.length;

    let spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load('./models/textures/point_light.png'),
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 1
    });

    for (let i = 0; i < createPointLightsLength; i++) {
        let mesh = model.object3D.children[i];
        if (mesh instanceof THREE.Mesh) {
            let pointLightMesh = new THREE.Sprite( spriteMaterial );
            pointLightMesh.scale.set(0.04, 0.04, 0.04);

            let fn = function () {
                let boundingSpherePos = new THREE.Vector3(
                    mesh.geometry.boundingSphere.center.x,
                    mesh.geometry.boundingSphere.center.y,
                    mesh.geometry.boundingSphere.center.z);
                pointLightMesh.position.set(boundingSpherePos.x, boundingSpherePos.y, boundingSpherePos.z);
                scene.add(pointLightMesh);
                scene.postRenderFunctions.splice(scene.postRenderFunctions.indexOf(fn), 1);
            };
            scene.postRender(fn);

            let pL = new RODIN.THREEObject(pointLightMesh);

            for (let i = 0; i < animationsPointLight.length; i++) {
                animationsPointLight[i].duration(1000);
                pL.animator.add(animationsPointLight[i]);
            }
            pL.animator.start('light1');
            pL.on(EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {
                let play = animationsPointLight[Math.randomIntIn(0, animationsPointLight.length - 1)].name;
                pL.animator.start(play);
            });
        }
    }
}
