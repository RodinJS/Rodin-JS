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

let a = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), new THREE.MeshLambertMaterial({color: 0xf15245})));
a.on('ready', (e) => {
    scene.add(a.object3D);
    a.object3D.position.set(2, 0.5, 2);
    a.raycastable = true;
});


// todo change line points position
function addPoint(direction) {
    scene.scene.children.map(child => {
        if (child.name == 'line') {
            scene.scene.remove(child);
        }
    });

    let splinepts = [];
    let n = 1;
    let g = -9.8;
    let l = 0.1;
    direction = direction.normalize();
    direction.multiplyScalar(2);
    for (let i = 0; i < n; i += l) {
        let x = i * Math.sqrt(direction.x * direction.x + direction.z * direction.z);
        let y = (-direction.y) * i + g * i * i / 2;
        splinepts.push(new THREE.Vector2(x, y));
    }
    let splineShape = new THREE.Shape();
    splineShape.moveTo(0, 0);
    splineShape.splineThru(splinepts);

    let points = splineShape.createPointsGeometry();
    let line = new THREE.Line(points, new THREE.LineBasicMaterial({color: 0x808080}));
    line.name = 'line';
    line.position.copy(controllerL.getWorldPosition());
    line.rotation.y = -getAngle(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(controllerL.getWorldDirection().x, controllerL.getWorldDirection().z)
    );
    scene.add(line);
    createPointsRaycaster(line);

}
function createPointsRaycaster(line) {

    let vert = line.geometry.vertices;
    let raycaster = new Raycaster();
    for (let i = 0; i < vert.length - 1; i++) {
        raycaster.setScene(scene.scene);
        raycaster.ray.origin.copy(line.getWorldPosition().add(vert[i]));

        let curVertex = vert[i].clone();
        let nextVertex = vert[i + 1].clone();

        raycaster.ray.direction = nextVertex.sub(curVertex);
        //nextVertex is now the difference
        //vector of two points in our line
        raycaster.far = nextVertex.length();
        line.raycaster = raycaster;
        let objs = raycaster.raycast();
        if (objs.length) {
            console.log(objs);
            break;
        }
    }
}

function dotAngle(a, b) {
    return Math.acos((a.x * b.x + a.y * b.y) / a.length() / b.length());
}
function getAngle(a, b) {
    a = a.sub(b);
    if (a.x >= 0 && a.y >= 0) {
        return dotAngle(a, new THREE.Vector2(1, 0));
    } else if (a.x >= 0 && a.y < 0) {
        return Math.PI * 2.0 - dotAngle(a, new THREE.Vector2(1, 0));
    } else if (a.x < 0 && a.y < 0) {
        return Math.PI * 2.0 - dotAngle(a, new THREE.Vector2(1, 0));
    } else {
        return dotAngle(a, new THREE.Vector2(1, 0));
    }
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