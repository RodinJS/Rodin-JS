import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {controllerL, controllerR} from './DnDVive_c.js';

let scene = SceneManager.get();
scene.scene.background = new THREE.Color(0xb5b5b5);

let controls = scene.controls;

let mouseController = new MouseController();
SceneManager.addController(mouseController);

let floor = new RODIN.THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(25, 25, 50, 50),new THREE.MeshLambertMaterial({color: 0x676d6f, wireframe:true})));
floor.on('ready', (e) => {
    scene.add(floor.object3D);
    floor.object3D.rotation.x = -Math.PI/2;
    floor.raycastable = true;
});

let a = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2),new THREE.MeshLambertMaterial({color: 0xf15245})));
a.on('ready', (e) => {
    scene.add(a.object3D);
    a.object3D.position.set(3,0.5,3);
    a.raycastable = true;
});

/// Add light
let light1 = new THREE.DirectionalLight(0xcccccc);
light1.position.set(2, 3, 2);
scene.add(light1);

scene.add(new THREE.AmbientLight(0xaaaaaa));

let light2 = new THREE.DirectionalLight(0xb5b5b5);
light2.position.set(-3, -3, -3);
scene.add(light2);


controllerL.onKeyDown =  controllerKeyDown;
function controllerKeyDown(keyCode) {
    if(controllerL.intersected){
        console.log('controllerL', controllerL);
        console.log('intersected', controllerL.intersected);
        console.log('distance', controllerL.intersected[0].distance);
        console.log('point', controllerL.intersected[0].point);
    }

    let pointObj = new RODIN.THREEObject(new THREE.Mesh(new THREE.SphereGeometry(0.2, 2)));
    pointObj.on('ready', (e) => {
        pointObj.object3D.Sculpt.setGlobalPosition(controllerL.intersected[0].point);
        controllerL.add(pointObj);
    });

    /*let targetGeometry = new THREE.Geometry();
    targetGeometry.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
    );

    let teleportingLine = new THREE.Line(targetGeometry, new THREE.LineBasicMaterial({color: 0xff0000}));
    teleportingLine.name = 'teleportingLine';*/
    //let teleportingLineDistance = this.raycastingLine.object3D.geometry.vertices[1].z
    //teleportingLine.geometry.vertices[1].z = teleportingLineDistance;
    //this.raycastingLine = new THREEObject(teleportingLine);
}

scene.preRender(() => {

});