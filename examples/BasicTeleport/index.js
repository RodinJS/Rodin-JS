import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

import {Raycaster} from '../../_build/js/rodinjs/raycaster/Raycaster.js';

import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {controllerL, controllerR} from './DnDVive_c.js';

let scene = SceneManager.get();
scene.scene.background = new THREE.Color(0xb5b5b5);

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

// todo check if raycaster.raycast().length is null always and line didn't change position
let raycaster = new Raycaster();
raycaster.setScene(scene.scene);
let cylinderHeight = 0.3;
let raycastPoint = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, cylinderHeight, 10));
scene.add(raycastPoint);
let n = 1;
let g = -9.8;
let l = 0.01;
function addPoint(direction) {
    let points = [];
    direction = direction.normalize();
    direction.multiplyScalar(6);

    let i = 0;
    for (let time = 0; time < n; time += l) {
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
            if (objs.length) {
                createLine(points);
                raycastPoint.position.copy(controllerL.getWorldPosition().add(points[i]));
                console.log(raycaster.far);
                raycastPoint.position.y += raycaster.far;
                break;
            }
        }
        ++i;
    }
}

function createLine(points) {
    scene.scene.children.map(child => {
        if (child.name == 'line') {
            scene.scene.remove(child);
        }
    });

    let splineShape = new THREE.CatmullRomCurve3(points);
    let tube = new THREE.TubeBufferGeometry(splineShape, 25, 0.01, 4);
    let line = THREE.SceneUtils.createMultiMaterialObject(tube, [
        new THREE.MeshLambertMaterial({
            color: 0x32c5f3
        })]);
    line.name = 'line';
    line.position.copy(controllerL.getWorldPosition());
    scene.add(line);
}

controllerL.onKeyDown = controllerKeyDown;
function controllerKeyDown(keyCode) {
    /*if (controllerL.intersected.length) {
     //console.log('controllerL', controllerL);
     //console.log('intersected', controllerL.intersected);
     //console.log('distance', controllerL.intersected[0].distance);
     //console.log('point', controllerL.intersected[0].point);
     let pointerObj = new RODIN.THREEObject(new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10)));
     pointerObj.on('ready', (e) => {
     controllerL.add(pointerObj.object3D);
     pointerObj.object3D.name = 'pointerObj';
     pointerObj.object3D.Sculpt.setGlobalPosition(controllerL.intersected[0].point);
     });
     }*/
}

scene.preRender(() => {

    if (controllerL) {
        addPoint(controllerL.getWorldDirection());
    }
    /*if (controllerL.intersected.length) {
     controllerL.children.map(child => {
     if (child.name == 'pointerObj') {
     child.Sculpt.setGlobalPosition(controllerL.intersected[0].point);
     }
     });
     }*/
});