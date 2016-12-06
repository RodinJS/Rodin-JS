import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {FBXModelObject} from '../../../_build/js/rodinjs/sculpt/FBXModelObject.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';
import {Time} from '../../../_build/js/rodinjs/time/Time.js';
import {Text} from '../../../_build/js/rodinjs/sculpt/elements/Text.js';

const time = Time.getInstance();
let scene = SceneManager.get();

// export fbx group
export const fbxGroup = new RODIN.THREEObject(new THREE.Object3D());
fbxGroup.on(EVENT_NAMES.READY, () => {
    fbxGroup.object3D.position.x = 10;
    fbxGroup.object3D.position.z = 10;
    fbxGroup.object3D.rotation.y = Math.PI;
});

const fbxObject = new FBXModelObject('./models/fbx/boxes.FBX');
fbxObject.on(EVENT_NAMES.READY, () => {
    let s = 0.2;
    console.log(fbxObject);
    fbxObject.object3D.scale.set(s, s, s);
    fbxObject.object3D.rotation.x = -Math.PI / 2;
    fbxGroup.object3D.add(fbxObject.object3D);
});

fbxObject.on(EVENT_NAMES.UPDATE, () => {
    fbxObject.object3D.rotation.z += time.deltaTime() * 0.0001;
});

const text = new Text({text: 'Fbx', fontSize: 1, color: 0xffffff});

text.on(EVENT_NAMES.READY, () => {
    text.object3D.rotation.y = Math.PI / 4;
    text.object3D.position.y = 3;
    fbxGroup.object3D.add(text.object3D);
});

scene.add(fbxGroup.object3D);