import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {ModelLoader} from '../../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';
import {Time} from '../../../_build/js/rodinjs/time/Time.js';
import {Text} from '../../../_build/js/rodinjs/sculpt/elements/Text.js';

const time = Time.getInstance();
let scene = SceneManager.get();

// export json group
export const jsonGroup = new RODIN.THREEObject(new THREE.Object3D());

const jsonObject = ModelLoader.load('./models/json/box_anim.js');
jsonObject.on(EVENT_NAMES.READY, () => {
    jsonGroup.object3D.add(jsonObject.object3D);
    jsonObject.object3D.rotation.x = -Math.PI/2;
    jsonObject.object3D.scale.set(.5, .5, .5);
});

jsonObject.on(EVENT_NAMES.UPDATE, () => {
    //jsonObject.object3D.rotation.y += time.deltaTime() * 0.0001;
});

const text = new Text({text: 'json', fontSize: 1, color: 0xffffff});

text.on(EVENT_NAMES.READY, () => {
    text.object3D.rotation.y = Math.PI / 4;
    text.object3D.position.y = 4;
    jsonGroup.object3D.add(text.object3D);
});

scene.add(jsonGroup.object3D);