import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {OculusController} from '../../_build/js/rodinjs/controllers/OculusController.js';
import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';

let scene = SceneManager.get();
let camera = scene.camera;
let target = new THREE.Mesh(new THREE.SphereGeometry(0.01, 5, 5), new THREE.MeshBasicMaterial({color: 0x336699, wireframe: true}));
target.position.z = -1;
camera.add(target);

let oculusController = new OculusController();

oculusController.onKeyDown = function () {
    this.engaged = true;
};

oculusController.onKeyUp = function () {
    this.engaged = false;
};

SceneManager.addController(oculusController);

scene.scene.background = new THREE.Color(0x808080);

let geometry = new THREE.PlaneGeometry(4, 4);
let material = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 1.0,
    metalness: 0.0
});

let floor = new THREE.Mesh(geometry, material);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

let light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 6, 0);
light.castShadow = true;
light.shadow.camera.top = 2;
light.shadow.camera.bottom = -2;
light.shadow.camera.right = 2;
light.shadow.camera.left = -2;
light.shadow.mapSize.set(4096, 4096);
scene.add(light);

let group = new THREE.Group();
group.position.set(1, 1, 0);
group.rotation.y = 0.4;
scene.add(group);

let geometries = [
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.ConeGeometry(0.2, 0.2, 64),
    new THREE.CylinderGeometry(0.2, 0.2, 0.2, 64),
    new THREE.IcosahedronGeometry(0.2, 3),
    new THREE.TorusGeometry(0.2, 0.04, 64, 32)
];

for (let i = 0; i < 20; i++) {

    let geometry = geometries[Math.floor(Math.random() * geometries.length)];
    let material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.0
    });

    let object = new THREE.Mesh(geometry, material);

    object.position.x = Math.random() * 4 - 2;
    object.position.y = Math.random() * 2;
    object.position.z = Math.random() * 4 - 2;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.setScalar(Math.random() + 0.5);

    object.castShadow = true;
    object.receiveShadow = true;

    let obj = new RODIN.THREEObject(object);

    obj.on('ready', () => {
        group.add(obj.object3D);
        obj.object3D.initialParent = obj.object3D.parent;
        RODIN.Raycastables.push(obj.object3D);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
        console.log(evt);
        obj.object3D.material.emissive.r = 1;
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
        console.log(evt);
        obj.object3D.material.emissive.r = 0;
    });

    if (Math.random() > 0.5) {
        object.material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            roughness: 0.7,
            metalness: 0.0
        });

        obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            console.log(evt);
            evt.target.object3D.initialParent = evt.target.object3D.parent;
            changeParent(evt.target.object3D, camera);
        });

        obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
            console.log(evt);
            changeParent(evt.target.object3D, evt.target.object3D.initialParent);
            delete evt.target.initialParent;
        });
    }
}
