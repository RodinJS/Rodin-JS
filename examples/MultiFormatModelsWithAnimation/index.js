import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';

import {colladaGroup} from './objects/collada_c.js';
import {fbxGroup} from './objects/fbx_c.js';
import {objGroup} from './objects/obj_c.js';
import {jsonGroup} from './objects/json_c.js';
import {jdGroup} from './objects/jd_c.js';

let alpha = 0;
[colladaGroup, fbxGroup, objGroup, jsonGroup, jdGroup].map(group => {
    group.object3D.position.x = Math.sin(alpha) * 7;
    group.object3D.position.z = Math.cos(alpha) * 7;
    alpha += 2 * Math.PI / 5;
});

let scene = SceneManager.get();
SceneManager.addController(new MouseController());

let floor = new RODIN.THREEObject(new THREE.Mesh(new THREE.PlaneGeometry(25, 25, 50, 50), new THREE.MeshLambertMaterial({color: 0x869295, wireframe:true})));
floor.on('ready', (e) => {
    scene.add(e.target.object3D);
    e.target.object3D.rotation.x = Math.PI/2;
});

let light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(1, 1, 1);
scene.add(light1);

let light2 = new THREE.DirectionalLight(0xcccccc);
light2.position.set(-1, -1, -1);
scene.add(light2);

let amlight = new THREE.AmbientLight(0x3e3e3e);
scene.add(amlight);

scene.scene.background = new THREE.Color(0x808080);
