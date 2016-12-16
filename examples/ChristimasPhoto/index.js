import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';

import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {Snow} from '../../_build/js/rodinjs/sculpt/Snow.js';
import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';
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
let terrain = ModelLoader.load("./models/terrain.json");
terrain.on('ready', () => {
    let textureSnow = new THREE.TextureLoader().load("./models/snow_texture.jpg");
    textureSnow.wrapS = THREE.RepeatWrapping;
    textureSnow.wrapT = THREE.RepeatWrapping;
    textureSnow.repeat.x = 15;
    textureSnow.repeat.y = 15;

    let mesh = new THREE.Mesh(terrain.object3D.children[0].geometry,
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
let christmasTree = ModelLoader.load('./models/Tree.obj');
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

let christmasTree_01 = ModelLoader.load('./models/Tree_01.obj');
christmasTree_01.on('ready', () => {
    /*christmasTree.object3D.material.materials[0].alphaTest = 0.35;
     christmasTree.object3D.material.materials[0].transparent = false;
     christmasTree.object3D.material.materials[0].side = THREE.DoubleSide;
     christmasTree.object3D.material.materials[0].clipShadows = true;*/

    christmasTree_01.object3D.scale.set(s+0.02, s+0.02, s+0.02);
    christmasTree_01.object3D.position.x = 3;
    christmasTree_01.object3D.position.y = 0;
    christmasTree_01.object3D.position.z = -3;

    /*christmasTree.object3D.castShadow = true;
     christmasTree.object3D.receiveShadow = true;*/
    scene.add(christmasTree_01.object3D);
});
// random tree
let tree = ModelLoader.load('./models/tree.json');
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

