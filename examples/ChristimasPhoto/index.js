import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {Snow} from '../../_build/js/rodinjs/sculpt/Snow.js';
import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';


let scene = SceneManager.get();
let controls = scene.controls;
let renderer = scene.renderer;
let threeScene = scene.scene;

renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = false;

scene.setCameraProperty("far", 150);

threeScene.fog = new THREE.Fog(0x7a8695, 0, 18);

/// Add light
let light1 = new THREE.DirectionalLight(0xcccccc, 1);
light1.position.set(4, 5, 4);
scene.add(light1);

scene.add(new THREE.AmbientLight(0xaaaaaa));

let light2 = new THREE.DirectionalLight(0xb5b5b5, 1);
light2.position.set(-5, -5, -5);
scene.add(light2);

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

// add Christmas Tree Scene
let ChristmasTreeScene = ModelLoader.load("./models/ChristmasTreeScene.obj");
ChristmasTreeScene.on('ready', () => {
    scene.add(ChristmasTreeScene.object3D);
});

// add point light
let pointLight = ModelLoader.load("./models/pointLight.JD");
pointLight.on('ready', () => {
    createRaycastablesObjects(pointLight);
});

function createRaycastablesObjects(model) {
    let raycastablesObjectsLenght = model.object3D.children.length;

    let material = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1,
        map: new THREE.TextureLoader().load('./models/textures/point_light.png'),
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 0.7
    });
    let lightGeometry = new THREE.Geometry();
    let lightVec = new THREE.Vector3(0, 0, 0);
    lightGeometry.vertices.push(lightVec);

    for (let i = 0; i < raycastablesObjectsLenght; i++) {
        let mesh = model.object3D.children[i];
        if (mesh instanceof THREE.Mesh) {
            let fn = function () {
                let boundingSpherePos = new THREE.Vector3(
                    mesh.geometry.boundingSphere.center.x,
                    mesh.geometry.boundingSphere.center.y,
                    mesh.geometry.boundingSphere.center.z
                );
                let pointLightMesh = new THREE.Points(lightGeometry, material);
                pointLightMesh.position.set(boundingSpherePos.x, boundingSpherePos.y, boundingSpherePos.z);
                scene.add(pointLightMesh);

                scene.postRenderFunctions.splice(scene.postRenderFunctions.indexOf(fn), 1);
            };
            scene.postRender(fn);
        }
    }
}