import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

import {Raycaster} from '../../_build/js/rodinjs/raycaster/Raycaster.js';
import {ModelLoader} from '../../_build/js/rodinjs/sculpt/ModelLoader.js';

import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {controllerL, controllerR} from './DnDVive_c.js';

let scene = SceneManager.get();
scene.scene.background = new THREE.Color(0xb5b5b5);
let camera = scene.camera;
let controls = scene.controls;

let mouseController = new MouseController();
SceneManager.addController(mouseController);

/// Add light
let light1 = new THREE.DirectionalLight(0xcccccc);
light1.position.set(2, 3, 2);
scene.add(light1);

scene.add(new THREE.AmbientLight(0xaaaaaa));

let light2 = new THREE.DirectionalLight(0xb5b5b5);
light2.position.set(-3, -3, -3);
scene.add(light2);

let character = new RODIN.THREEObject(new THREE.Object3D());
character.on('ready', (e) => {
    let matrix = new THREE.Matrix4();
    character.object3D.Sculpt.setGlobalMatrix(matrix);
    character.object3D.add(camera);
    character.object3D.add(controllerL);
    character.object3D.add(controllerR);
    scene.add(character.object3D);
});

let floor = new RODIN.THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(25, 25, 50, 50), new THREE.MeshLambertMaterial({
    color: 0x676d6f,
    wireframe: true
})));
floor.on('ready', (e) => {
    scene.add(floor.object3D);
    floor.object3D.rotation.x = -Math.PI / 2;
    floor.raycastable = true;
    floor.object3D.name = 'floor';
});

let a = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.5), new THREE.MeshLambertMaterial({color: 0xf15245})));
a.on('ready', (e) => {
    scene.add(a.object3D);
    a.object3D.position.set(2, 0.5, 0);
    a.raycastable = true;
});

// todo find better solution for textures
let texture = new THREE.TextureLoader().load('texture/gradient.png');
let materialGradient = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.05,
    side: THREE.FrontSide
});
let textureVertical = new THREE.TextureLoader().load('texture/gradient_vertical.png');
let materialGradientVertical = new THREE.MeshBasicMaterial({
    map: textureVertical,
    transparent: true,
    side: THREE.BackSide,
    alphaTest: 0.05,
    //transparent: false
});
let textureRadial = new THREE.TextureLoader().load('texture/gradientRadial.png');
let materialGradientRadial = new THREE.MeshBasicMaterial({
    map: textureRadial,
    transparent: true,
    side: THREE.DoubleSide
});
let raycaster = new Raycaster();
raycaster.setScene(scene.scene);
let cylinderHeight = 0.2;
let raycastPoint = new RODIN.THREEObject(new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, cylinderHeight, 12, 1, true),
    materialGradientVertical
));
//let raycastPoint = ModelLoader.load('./model/raycastPoint.obj');
raycastPoint.on('ready', () => {
    scene.add(raycastPoint.object3D);
    //raycastPoint.object3D.children[0].material = materialGradientVertical;
    //raycastPoint.object3D.children[1].material = materialGradientRadial;
    raycastPoint.object3D.visible = false;
});
let n = 200;
let g = -9.8;
let m = 0.01;
function addPoint(direction) {
    let points = [];
    direction = direction.normalize();
    direction.multiplyScalar(6);

    for (let time = 0, i = 0; i < n; i++, time = m * i) {
        let x = time * (-direction.x);
        let y = time * (-direction.y) + g * time * time / 2;
        let z = time * (-direction.z);

        let pointPosition = new THREE.Vector3(x, y, z);
        points.push(pointPosition);
        if (i > 0) {
            raycaster.ray.origin.copy(controllerL.getWorldPosition().add(points[i - 1])); //////////
            let curVertex = points[i - 1].clone();
            let nextVertex = points[i].clone();
            raycaster.ray.direction = nextVertex.sub(curVertex);
            //nextVertex is now the difference
            //vector of two points in our line
            raycaster.far = nextVertex.length();
            let objs = raycaster.raycast();
            controllerL.raycastObject = objs;
            if (objs.length && raycastPoint.object3D) {
                createLine(points);
                if (!raycastPoint.object3D.visible) {
                    raycastPoint.object3D.visible = true;
                }
                raycastPoint.object3D.position.copy(objs[0].point);
                raycastPoint.object3D.position.y += cylinderHeight / 2;
                break;
            }
            if (i == n-1 && raycastPoint.object3D) {
                createLine(points);
                raycastPoint.object3D.visible = false;
            }
        }
    }
}

function createLine(points) {
    scene.scene.children.map(child => {
        if (child.name == 'line') {
            scene.scene.remove(child);
        }
    });
    if (points.length > 3){
        points.pop();
        points.pop();
    }

    let splineShape = new THREE.CatmullRomCurve3(points);
    let tube = new THREE.TubeBufferGeometry(splineShape, 15, 0.01, 3, false);
    let line = new THREE.Mesh(tube, materialGradient);
    //let line = THREE.SceneUtils.createMultiMaterialObject(tube, [materialGradient]);
    //console.log(line);
    line.name = 'line';
    line.position.copy(controllerL.getWorldPosition());
    scene.add(line);
}

controllerL.onKeyDown = controllerKeyDown;
function controllerKeyDown(keyCode) {
    if (controllerL.raycastObject) {
        let cameraPos = new THREE.Vector3(camera.position.x, 0, camera.position.z);
        character.object3D.Sculpt.setGlobalPosition(raycastPoint.object3D.getWorldPosition().sub(cameraPos));
    }
}

scene.preRender(() => {
    if (controllerL) {
        addPoint(controllerL.getWorldDirection());
    }
});