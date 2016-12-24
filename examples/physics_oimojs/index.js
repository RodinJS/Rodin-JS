import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';

import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {THREEObject} from '../../_build/js/rodinjs/sculpt/THREEObject.js';
import {Element} from '../../_build/js/rodinjs/sculpt/elements/Element.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

import {RigidBody} from '../../_build/js/rodinjs/physics/RigidBody.js';
import {RodinPhysics} from '../../_build/js/rodinjs/physics/RodinPhysics.js';

let mode = 'oimo';
let scene = SceneManager.get();
scene.scene.background = new THREE.Color(0xb5b5b5);

let mouseController = new MouseController();
SceneManager.addController(mouseController);

/// Add light
let light1 = new THREE.DirectionalLight(0xcccccc, 0.8);
light1.position.set(2, 3, 2);
scene.add(light1);
let light2 = new THREE.DirectionalLight(0xb5b5b5, 0.8);
light2.position.set(-3, -3, -3);
scene.add(light2);
scene.add(new THREE.AmbientLight(0xaaaaaa, 0.8));

/////////// physics ////////////////////
let physicsEngines = ["oimo", "cannon"];

let buttons = [];
/////
for (let i = 0; i < physicsEngines.length; i++) {
    let physicEngineChangeBtn = {};
    physicEngineChangeBtn.name = physicsEngines[i];
    physicEngineChangeBtn.width = 0.35;
    physicEngineChangeBtn.height = 0.35;
    physicEngineChangeBtn.background = {
        color: 0x1e1e20,
        opacity: 0.6
    };
    physicEngineChangeBtn.border = {
        width: 0.01,
        color: 0xff8800,
        opacity: 1,
        radius: 0.4
    };

    physicEngineChangeBtn.label = {
        text: physicsEngines[i],
        fontFamily: "Arial",
        fontSize: 0.08,
        color: 0xfbfbfb,
        opacity: 1,
        position: {h: 50, v: 50}
    };

    buttons.push(new Element(physicEngineChangeBtn));
    buttons[i].on('ready', (evt) => {
        let object = evt.target.object3D;
        object.position.set(-0.75 + i * 1.5, 2, -1);
        object.material.opacity = 0.5;

        evt.target.active = false;

        scene.add(object);
        RODIN.Raycastables.push(object);
        evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            evt.target.animate({
                property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
                to: new THREE.Vector3(1.1, 1.1, 1.1)
            });
        });
        evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            evt.target.animate({
                property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
                to: new THREE.Vector3(1, 1, 1)
            });
        });
    });
}

buttons[0].on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY, () => {
    if (mode != 'oimo') {
        location.search = '?mode=' + physicsEngines[0];
    }
});

buttons[1].on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY, () => {
    if (mode != 'cannon') {
        location.search = '?mode=' + physicsEngines[1];
    }
});

function getPhysicsModeFromURL() {
    let pairs = window.location.search.substring(1).split("&"),
        obj = {},
        pair,
        i;

    for (i in pairs) {
        if (pairs[i] === "") continue;

        pair = pairs[i].split("=");
        obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    return obj.mode/*.toLocaleLowerCase()*/;
}

if (!getPhysicsModeFromURL())
    window.history.pushState('page2', document.title, window.location.pathname + '?mode=oimo');

mode = getPhysicsModeFromURL();

setTimeout(() => {
    if (mode === 'oimo') {
        buttons[0].active = true;
        buttons[1].active = false;
        buttons[0].object3D.material.opacity = 1;
    } else {
        buttons[1].active = true;
        buttons[0].active = false;
        buttons[1].object3D.material.opacity = 1;
    }
}, 50);

scene.physics = RodinPhysics.getInstance(getPhysicsModeFromURL());


//Setting up world
scene.physics.setupWorldGeneralParameters(0, -2.82, 0, 8, true, 32); // todo check 32-8 difference

let shiftFromCenterByZ = -5;
///////////////// creating floor ///////////////////////
// todo distinguish ground from plane
let geometry = new THREE.PlaneGeometry(8, 4);
let material = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 1.0,
    metalness: 0.0,
    opacity: 0.8,
    transparent: true,
    side: THREE.DoubleSide
});
let ground = new THREEObject(new THREE.Mesh(geometry, material));
ground.on('ready', () => {
    ground.object3D.rotation.x = -Math.PI / 2;
    ground.object3D.position.set(0, -1, shiftFromCenterByZ);
    scene.add(ground.object3D);

    // add physic
    let groundRigitBody = new RigidBody({
        owner: ground.object3D,
        mass: 0,
        type: "plane",
        move: false
    });
    groundRigitBody.name = "ground";
});

///////////////// creating object ///////////////////////
let mass = 0.2;

let group = new THREE.Group();
group.position.set(0, 3, shiftFromCenterByZ);
group.rotation.x = Math.PI / 2;
group.rotation.y = Math.PI / 4;
scene.add(group);

let geometries = [
    new THREE.BoxGeometry(0.2, 0.5, 0.2),
    new THREE.SphereGeometry(0.2, 64),
];

// add raycastable objects to scene
for (let i = 0; i < 50; i++) {
    let geometry = geometries[Math.floor(Math.random() * geometries.length)];
    let material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.0
    });

    let object = new THREE.Mesh(geometry, material);
    object.position.x = (Math.random() - 0.5) * 6;
    object.position.y = (Math.random() - 0.5) * 3;
    object.position.z = (Math.random() - 0.5) * 4;
    object.rotation.x = (Math.random() - 0.5) * 2 * Math.PI;
    object.rotation.y = (Math.random() - 0.5) * 2 * Math.PI;
    object.rotation.z = (Math.random() - 0.5) * 2 * Math.PI;
    object.scale.set(1, 1, 1);

    let obj = new THREEObject(object);
    obj.on('ready', () => {
        group.add(obj.object3D);
        RODIN.Raycastables.push(obj.object3D);
        obj.object3D.initialParent = obj.object3D.parent;

        // add physic
        let objectRigitBody = new RigidBody({
            owner: obj.object3D,
            mass: mass,
            move: true
        });
        objectRigitBody.name = obj.object3D.geometry.type;
    });
}

scene.preRender(() => {
    // Update scene's objects physics.
    scene.physics.updateWorldPhysics(RODIN.Time.deltaTime());
});
