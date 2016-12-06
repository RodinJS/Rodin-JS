import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {ColladaModelObject} from '../../../_build/js/rodinjs/sculpt/ColladaModelObject.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';
import {Time} from '../../../_build/js/rodinjs/time/Time.js';
import {Text} from '../../../_build/js/rodinjs/sculpt/elements/Text.js';

const time = Time.getInstance();
let scene = SceneManager.get();

// export collada group
export const colladaGroup = new RODIN.THREEObject(new THREE.Object3D());
colladaGroup.on(EVENT_NAMES.READY, () => {
    colladaGroup.object3D.position.x = -10;
    colladaGroup.object3D.position.z = -10;
});

const colladaObject = new ColladaModelObject('./models/collada/boxes.DAE');
colladaObject.on(EVENT_NAMES.READY, () => {
    colladaObject.object3D.rotation.x = -Math.PI / 2;
    colladaGroup.object3D.add(colladaObject.object3D);
});
colladaObject.on(EVENT_NAMES.UPDATE, () => {
    colladaObject.object3D.rotation.z += time.deltaTime() * 0.0001;
});

const text = new Text({text: 'Collada', fontSize: 1, color: 0xffffff});

text.on(EVENT_NAMES.READY, () => {
    text.object3D.rotation.y = Math.PI / 4;
    text.object3D.position.y = 3;
    colladaGroup.object3D.add(text.object3D);
});

scene.add(colladaGroup.object3D);