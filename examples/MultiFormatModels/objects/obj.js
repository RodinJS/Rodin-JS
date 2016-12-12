import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {ModelLoader} from '../../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';
import {Time} from '../../../_build/js/rodinjs/time/Time.js';
import {Text} from '../../../_build/js/rodinjs/sculpt/elements/Text.js';

const time = Time.getInstance();
let scene = SceneManager.get();

// export obj group
export const objGroup = new RODIN.THREEObject(new THREE.Object3D());

const objObject = ModelLoader.load('./models/obj/boxes.obj');
objObject.on(EVENT_NAMES.READY, () => {
    objGroup.object3D.add(objObject.object3D);
});

objObject.on(EVENT_NAMES.UPDATE, () => {
    objObject.object3D.rotation.y += time.deltaTime() * 0.0001;
});

const text = new Text({text: 'OBJ', fontSize: 1, color: 0xffffff});

text.on(EVENT_NAMES.READY, () => {
    text.object3D.rotation.y = -Math.PI / 4;
    text.object3D.position.y = 4;
    objGroup.object3D.add(text.object3D);
});

scene.add(objGroup.object3D);