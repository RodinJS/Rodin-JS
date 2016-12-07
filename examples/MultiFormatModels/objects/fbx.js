import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {ModelLoader} from '../../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';
import {Time} from '../../../_build/js/rodinjs/time/Time.js';
import {Text} from '../../../_build/js/rodinjs/sculpt/elements/Text.js';

const time = Time.getInstance();
let scene = SceneManager.get();

// export fbx group
export const fbxGroup = new RODIN.THREEObject(new THREE.Object3D());

const fbxObject = ModelLoader.load('./models/fbx/boxes.FBX');
fbxObject.on(EVENT_NAMES.READY, () => {
    let s = 0.1;
    fbxObject.object3D.scale.set(s, s, s);
    fbxObject.object3D.rotation.x = -Math.PI / 2;
    fbxGroup.object3D.add(fbxObject.object3D);
});

fbxObject.on(EVENT_NAMES.UPDATE, () => {
    fbxObject.object3D.rotation.z += time.deltaTime() * 0.0001;
});

const text = new Text({text: 'Fbx', fontSize: 1, color: 0xffffff});

text.on(EVENT_NAMES.READY, () => {
    text.object3D.rotation.y = -Math.PI / 2;
    text.object3D.position.y = 4;
    fbxGroup.object3D.add(text.object3D);
});

scene.add(fbxGroup.object3D);