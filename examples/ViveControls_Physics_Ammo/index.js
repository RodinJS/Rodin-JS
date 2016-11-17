import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {WTF} from '../../_build/js/rodinjs/RODIN.js';

import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';

console.log(RODIN);

import '../../_build/js/vendor/three/examples/js/controls/VRControls.js';
import '../../_build/js/vendor/three/examples/js/effects/VREffect.js';
import '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js';
import '../../_build/js/vendor/three/examples/js/WebVR.js';


WTF.is('Rodin.JS v0.0.1');

/////////////////////////////WebVR Example/////////////////////////////////////

// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.gammaInput = true;
renderer.gammaOutput = true;

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

// Create a three.js camera.
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

// Apply VR headset positional data to camera.
let controls = new THREE.VRControls(camera);
controls.standing = true;

// Apply VR stereo rendering to renderer.
let effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
let params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};

let manager = new WebVRManager(renderer, effect, params);

let raycaster;

let controllerL = new RODIN.ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, null, 2);
controllerL.standingMatrix = controls.getStandingMatrix();

let controllerR = new RODIN.ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, null, 3);
controllerR.standingMatrix = controls.getStandingMatrix();

scene.add(controllerL);
scene.add(controllerR);

let loader = new THREE.OBJLoader();
loader.setPath('./object/');
loader.load('vr_controller_vive_1_5.obj', function (object) {

    let loader = new THREE.TextureLoader();
    loader.setPath('./img/');

    object.children[0].material.map = loader.load('onepointfive_texture.png');
    object.children[0].material.specularMap = loader.load('onepointfive_spec.png');

    controllerL.add(object.clone());
    controllerR.add(object.clone());
});

raycaster = new RODIN.Raycaster(scene);

/////////// physics ////////////////////

let physics = new RODIN.Physics( 0, scene );

//Setting up the scene

physics.sceneSetup(-10);

/*let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
let overlappingPairCache = new Ammo.btDbvtBroadphase();
let solver = new Ammo.btSequentialImpulseConstraintSolver();
scene.world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
scene.world.setGravity(new Ammo.btVector3(0, -10, 0));*/

///////////////// creating floor ///////////////////////
let floorWidth = 20;
let floorDepth = 20;
let floorHeight = 0.1;

let geometry = new THREE.PlaneGeometry(floorWidth, floorDepth);
let material = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 1.0,
    metalness: 0.0
});
let floor = new THREE.Mesh(geometry, material);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, 0, 0);
floor.receiveShadow = true;

//floor.width = floorWidth;
//floor.depth = floorDepth;
//floor.height = floorHeight;

scene.add(floor);
//physics.objectCollisionDetect( floor, 0);
physics.floorCollisionDetect( floor );
//floorCollisionDetect(floor);

function floorCollisionDetect(floor) {

    let floorShape = new Ammo.btBoxShape(new Ammo.btVector3(floorWidth, floorHeight, floorDepth)); // Create block 50x2x50
    let floorTransform = new Ammo.btTransform();
    floorTransform.setIdentity();
    floorTransform.setOrigin(new Ammo.btVector3(floor.position.x, -floorHeight / 2, floor.position.z)); // Set initial position

    let floorMass = 0; // Mass of 0 means ground won't move from gravity or collisions
    let localInertia = new Ammo.btVector3(0, 0, 0);
    let motionState = new Ammo.btDefaultMotionState(floorTransform);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(floorMass, motionState, floorShape, localInertia);
    let floorAmmo = new Ammo.btRigidBody(rbInfo);
    scene.world.addRigidBody(floorAmmo);
    console.log(scene.world);
}

scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

let light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 6, 0);
light.castShadow = true;
light.shadow.camera.top = 4;
light.shadow.camera.bottom = -4;
light.shadow.camera.right = 4;
light.shadow.camera.left = -4;
light.shadow.mapSize.set(4096, 4096);
scene.add(light);

// add raycastable objects to scene

let objectsArray = [];

let group = new THREE.Group();
group.position.set(1, 1, 0);
group.rotation.y = 0.4;
scene.add(group);

let geometries = [
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    //new THREE.BoxBufferGeometry(0.2, 0.2, 0.2),
    new THREE.ConeGeometry(0.2, 0.2, 64),
    new THREE.CylinderGeometry(0.1, 0.1, 0.1, 64),
    new THREE.IcosahedronGeometry(0.2, 1),
    new THREE.TorusGeometry(0.2, 0.08, 12, 12)
];

for (let i = 0; i < 12; i++) {
    let geometry = geometries[Math.floor(Math.random() * geometries.length)];
    //console.log( geometry instanceof  THREE.BoxGeometry);
    let material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0.0
    });

    let object = new THREE.Mesh(geometry, material);
    object.position.x = (Math.random() - 0.5) * 2;
    object.position.y = (Math.random() - 0.5) * 2;
    object.position.z = (Math.random() - 0.5) * 2;
    object.rotation.x = (Math.random() - 0.5) * 2 * Math.PI;
    object.rotation.y = (Math.random() - 0.5) * 2 * Math.PI;
    object.rotation.z = (Math.random() - 0.5) * 2 * Math.PI;
    object.scale.set(1, 1, 1);

    object.castShadow = true;
    object.receiveShadow = true;

    //console.log( object.min, object.max );

    let obj = new RODIN.THREEObject(object);

    obj.on('ready', () => {
        group.add(obj.object3D);
        obj.object3D.initialParent = obj.object3D.parent;
        RODIN.Raycastables.push(obj.object3D);
    });

    // hover

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt, controller) => {
        if (!obj.hoveringObjects) {
            obj.hoveringObjects = [];
        }
        if (obj.hoveringObjects.indexOf(controller) > -1) return;
        obj.object3D.material.emissive.r = 1;
        obj.hoveringObjects.push(controller);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (controller) => {
        if (obj.hoveringObjects.indexOf(controller) > -1) {
            obj.hoveringObjects.splice(obj.hoveringObjects.indexOf(controller));
        }
        if (obj.hoveringObjects.length !== 0 || obj.object3D.parent !== obj.object3D.initialParent) {
            return;
        }
        obj.object3D.material.emissive.r = 0;
    });

    // CONTROLLER_KEY

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt, controller) => {
        obj.object3D.scale.set(1.1, 1.1, 1.1);
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, (evt, controller) => {
        obj.object3D.scale.set(1, 1, 1);

    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK, (evt, controller) => {
        if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY1) {
        }
        if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) {
        }
    });

    // Controller touch

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_START, (evt, controller) => {
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_END, (evt, controller) => {
    });

    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TAP, (evt, controller) => {
    });


    //physics.objectCollisionDetect( obj.object3D, 0.02);
    //console.log( object.geometry.parameters );

    creatingObjectPhysics(obj);
}

// todo enablePhysics({ mass });
// create class

function creatingObjectPhysics(obj) {

    let position_x = obj.object3D.position.x;
    let position_y = obj.object3D.position.y;
    let position_z = obj.object3D.position.z;

    let mass = 3 * 3 * 3; // Matches box dimensions for simplicity
    let startTransform = new Ammo.btTransform();
    startTransform.setIdentity();
    startTransform.setOrigin(new Ammo.btVector3(position_x, position_y, position_z)); // Set initial position

    let localInertia = new Ammo.btVector3(0, 0, 0);

    let boxShape = new Ammo.btBoxShape(new Ammo.btVector3(0.02, 0.02, 0.02)); // Box is 3x3x3
    boxShape.calculateLocalInertia(mass, localInertia);

    let motionState = new Ammo.btDefaultMotionState(startTransform);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, boxShape, localInertia);
    let objAmmo = new Ammo.btRigidBody(rbInfo);
    scene.world.addRigidBody(objAmmo);

    objAmmo.mesh = obj.object3D; // Assign the Three.js mesh in `obj`, this is used to update the model position later
    objectsArray.push(objAmmo); // Keep track of this obj
}

function updateObjectsPhysics() {
    scene.world.stepSimulation(1 / 60, 5); // Tells Ammo.js to apply physics for 1/60th of a second with a maximum of 5 steps
    let i, transform = new Ammo.btTransform(), origin, rotation;

    for (i = 0; i < objectsArray.length; i++) {
        objectsArray[i].getMotionState().getWorldTransform(transform); // Retrieve box position & rotation from Ammo

        // Update position
        origin = transform.getOrigin();
        objectsArray[i].mesh.position.x = origin.x();
        objectsArray[i].mesh.position.y = origin.y();
        objectsArray[i].mesh.position.z = origin.z();

        // Update rotation
        rotation = transform.getRotation();
        objectsArray[i].mesh.quaternion.x = rotation.x();
        objectsArray[i].mesh.quaternion.y = rotation.y();
        objectsArray[i].mesh.quaternion.z = rotation.z();
        objectsArray[i].mesh.quaternion.w = rotation.w();
    }
}

controllerL.onKeyDown = controllerKeyDown;
controllerL.onKeyUp = controllerKeyUp;

controllerR.onKeyDown = controllerKeyDown;
controllerR.onKeyUp = controllerKeyUp;

function controllerKeyDown(keyCode) {
    if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }

    if (this.intersected && this.intersected.length > 0) {
        this.intersected.map(intersect => {
            if (intersect.object3D.parent != intersect.object3D.initialParent) {
                return;
            }

            changeParent(intersect.object3D, this.reycastingLine);
            //let targetParent = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.04, 12, 12));
            let targetParent = new THREE.Object3D();
            this.reycastingLine.add(targetParent);
            targetParent.position.copy(intersect.object3D.position);
            changeParent(intersect.object3D, targetParent);

            this.pickedItems.push(intersect.object3D);
            if (intersect.initialRotX) {
                intersect.initialRotX = 0;
                intersect.initialRotY = 0;
            }
        });
    }

    this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, null, keyCode, this);
}

function controllerKeyUp(keyCode) {
    if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
    this.engaged = false;
    if (this.pickedItems && this.pickedItems.length > 0) {
        this.pickedItems.map(item => {
            let targetParent = item.parent;
            changeParent(item, item.initialParent);
            this.reycastingLine.remove(targetParent);
        });
        this.pickedItems = [];
    }
    this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, null, keyCode, this);
}

controllerL.onTouchUp = controllerTouchUp;
controllerL.onTouchDown = controllerTouchDown;

controllerR.onTouchUp = controllerTouchUp;
controllerR.onTouchDown = controllerTouchDown;

function controllerTouchDown(keyCode, gamepad) {

    if (!this.engaged || keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY1) return;

    if (this.intersected && this.intersected.length > 0) {
        this.intersected.map(intersect => {
            if (!gamepad.initialTouchX && gamepad.initialTouchX != 0) {
                gamepad.initialTouchX = -gamepad.axes[1];
                gamepad.initialTouchY = -gamepad.axes[0];
            }

            if (!intersect.initialRotX && intersect.initialRotX != 0) {

                intersect.initialRotX = +intersect.object3D.parent.rotation.x;
                intersect.initialRotY = +intersect.object3D.parent.rotation.y;
            }
            let x = (intersect.initialRotX + ((-gamepad.axes[1]) - gamepad.initialTouchX));
            let y = (intersect.initialRotY + ((-gamepad.axes[0]) - gamepad.initialTouchY));

            let directionY = new THREE.Vector3(0, 1, 0).normalize();
            let quaternionY = new THREE.Quaternion();
            quaternionY.setFromAxisAngle(directionY, -y);

            let directionX = new THREE.Vector3(1, 0, 0).normalize();
            let quaternionX = new THREE.Quaternion();
            quaternionX.setFromAxisAngle(directionX, x);

            intersect.object3D.parent.updateMatrixWorld();
            intersect.object3D.parent.quaternion.copy(new THREE.Quaternion().multiplyQuaternions(quaternionX, quaternionY));
        });
    }
    this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_START, null, keyCode, this);
}

function controllerTouchUp(keyCode, gamepad) {
    if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY1) return;
    if (this.intersected && this.intersected.length > 0) {
        this.intersected.map(intersect => {
            gamepad.initialTouchX = null;
            gamepad.initialTouchZ = null;
            intersect.initialRotX = 0;
            intersect.initialRotY = 0;

            let holderObj = intersect.object3D.parent;
            changeParent(intersect.object3D, intersect.object3D.initialParent);
            holderObj.rotation.set(0, 0, 0);
            changeParent(intersect.object3D, holderObj);
        });
    }
    this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_END, null, keyCode, this);
}

// Kick off animation loop
requestAnimationFrame(animate);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

// Request animation frame loop function
function animate(timestamp) {

    // Update controller.
    controllerL.update();
    controllerR.update();

    // Update VR headset position and apply to camera.
    controls.update();

    // Update scene's objects physics.
    //physics.updateObjectsPhysics();
    updateObjectsPhysics();

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


/*//Setting up the scene
 var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
 var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
 var overlappingPairCache = new Ammo.btDbvtBroadphase();
 var solver = new Ammo.btSequentialImpulseConstraintSolver();
 scene.world = new Ammo.btDiscreteDynamicsWorld( dispatcher, overlappingPairCache, solver, collisionConfiguration );
 scene.world.setGravity(new Ammo.btVector3(0, -12, 0));

 //Creating the ground
 var groundShape = new Ammo.btBoxShape(new Ammo.btVector3( 25, 1, 25 )); // Create block 50x2x50
 var groundTransform = new Ammo.btTransform();
 groundTransform.setIdentity();
 groundTransform.setOrigin(new Ammo.btVector3( 0, -1, 0 )); // Set initial position

 var groundMass = 0; // Mass of 0 means ground won't move from gravity or collisions
 var localInertia = new Ammo.btVector3(0, 0, 0);
 var motionState = new Ammo.btDefaultMotionState( groundTransform );
 var rbInfo = new Ammo.btRigidBodyConstructionInfo( groundMass, motionState, groundShape, localInertia );
 var groundAmmo = new Ammo.btRigidBody( rbInfo );
 scene.world.addRigidBody( groundAmmo );

 //Creating boxes
 var mass = 3 * 3 * 3; // Matches box dimensions for simplicity
 var startTransform = new Ammo.btTransform();
 startTransform.setIdentity();
 startTransform.setOrigin(new Ammo.btVector3( position_x, 20, position_z )); // Set initial position

 var localInertia = new Ammo.btVector3(0, 0, 0);

 var boxShape = new Ammo.btBoxShape(new Ammo.btVector3( 1.5, 1.5, 1.5 )); // Box is 3x3x3
 boxShape.calculateLocalInertia( mass, localInertia );

 var motionState = new Ammo.btDefaultMotionState( startTransform );
 var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, boxShape, localInertia );
 var boxAmmo = new Ammo.btRigidBody( rbInfo );
 scene.world.addRigidBody( boxAmmo );

 var boxes = [];
 boxAmmo.mesh = box; // Assign the Three.js mesh in `box`, this is used to update the model position later
 boxes.push( boxAmmo ); // Keep track of this box

 //Lights, camera, action!
 updateBoxes = function() {
 scene.world.stepSimulation( 1 / 60, 5 ); // Tells Ammo.js to apply physics for 1/60th of a second with a maximum of 5 steps
 var i, transform = new Ammo.btTransform(), origin, rotation;

 for ( i = 0; i < boxes.length; i++ ) {
 boxes[i].getMotionState().getWorldTransform( transform ); // Retrieve box position & rotation from Ammo

 // Update position
 origin = transform.getOrigin();
 boxes[i].mesh.position.x = origin.x();
 boxes[i].mesh.position.y = origin.y();
 boxes[i].mesh.position.z = origin.z();

 // Update rotation
 rotation = transform.getRotation();
 boxes[i].mesh.quaternion.x = rotation.x();
 boxes[i].mesh.quaternion.y = rotation.y();
 boxes[i].mesh.quaternion.z = rotation.z();
 boxes[i].mesh.quaternion.w = rotation.w();
 }
 };*/

/*
 // Heightfield parameters
 var terrainHeight = 6;
 var terrainWidth = 128;
 var terrainDepth = 128;

 // Physics variables
 var collisionConfiguration;
 var dispatcher;
 var broadphase;
 var solver;
 var physicsWorld;

 var heightData = null;
 var ammoHeightData = null;

 heightData = generateHeight( terrainWidth, terrainDepth );

 function initPhysics() {

 // Physics configuration

 collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
 dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
 broadphase = new Ammo.btDbvtBroadphase();
 solver = new Ammo.btSequentialImpulseConstraintSolver();
 physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
 physicsWorld.setGravity( new Ammo.btVector3( 0, -10, 0 ) );

 // Create the terrain body

 var groundShape = this.createTerrainShape( heightData );
 var groundTransform = new Ammo.btTransform();
 groundTransform.setIdentity();
 console.log(groundTransform);
 // Shifts the terrain, since bullet re-centers it on its bounding box.
 groundTransform.setOrigin( new Ammo.btVector3( 0, terrainHeight / 2, 0 ) );
 var groundMass = 0;
 var groundLocalInertia = new Ammo.btVector3( 0, 0, 0 );
 var groundMotionState = new Ammo.btDefaultMotionState( groundTransform );
 var groundBody = new Ammo.btRigidBody( new Ammo.btRigidBodyConstructionInfo( groundMass, groundMotionState, groundShape, groundLocalInertia ) );
 physicsWorld.addRigidBody( groundBody );

 }

 function generateHeight( width, depth ) {

 // Generates the height data (a sinus wave)

 var size = width * depth;
 var data = new Float32Array(size);

 return data;

 }

 function createTerrainShape() {

 // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
 var heightScale = 1;

 // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
 var upAxis = 1;

 // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
 var hdt = "PHY_FLOAT";

 // Set this to your needs (inverts the triangles)
 var flipQuadEdges = false;

 // Creates height data buffer in Ammo heap
 ammoHeightData = Ammo._malloc(4 * terrainWidth * terrainDepth);

 // Creates the heightfield physics shape
 var heightFieldShape = new Ammo.btHeightfieldTerrainShape(
 terrainWidth,
 terrainDepth,
 ammoHeightData,
 heightScale,
 terrainHeight,
 upAxis,
 hdt,
 flipQuadEdges
 );

 // Set horizontal scale
 var scaleX = terrainWidthExtents / ( terrainWidth - 1 );
 var scaleZ = terrainDepthExtents / ( terrainDepth - 1 );
 heightFieldShape.setLocalScaling( new Ammo.btVector3( scaleX, 1, scaleZ ) );
 // margin from object
 heightFieldShape.setMargin( 0.05 );

 return heightFieldShape;

 }
 */