import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {ModelLoader} from '../../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {EVENT_NAMES} from '../../../_build/js/rodinjs/constants/constants.js';
import {Time} from '../../../_build/js/rodinjs/time/Time.js';
import {Text} from '../../../_build/js/rodinjs/sculpt/elements/Text.js';

let scene = SceneManager.get();

// export jd group
export const jdGroup = new RODIN.THREEObject(new THREE.Object3D());

const jdObject = ModelLoader.load('./models/jd/box_anim.JD');
jdObject.on(EVENT_NAMES.READY, () => {
    jdObject.object3D.rotation.y = 3 * Math.PI / 5;
    jdGroup.object3D.add(jdObject.object3D);
    jdObject.object3D.scale.set(.5, .5, .5);

    const animations = jdObject.animator.getClips();

    for (let i = 0; i < animations.length; i++) {
        const animation = animations[i];
        const button = new Text({ text: `${animation.name}`, fontSize: .4, color: 0xffffff });
        button.on(EVENT_NAMES.READY, () => {
            button.object3D.rotation.y = Math.PI / 4 + Math.PI / 2;
            button.object3D.position.y = 5 - i * .5;
            jdGroup.object3D.add(button.object3D);
            button.raycastable = true;
        });

        button.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            if (!jdObject.animator.isPlaying()) {
                jdObject.animator.start(animation.name);
            } else if(jdObject.animator.isPlaying(animation.name)) {
                jdObject.animator.stop(animation.name);
            }
        });
    }
});

const text = new Text({ text: 'jd', fontSize: 1, color: 0xffffff });
text.on(EVENT_NAMES.READY, () => {
    text.object3D.rotation.y = Math.PI / 4 + Math.PI / 2;
    text.object3D.position.y = 6;
    jdGroup.object3D.add(text.object3D);
});

scene.add(jdGroup.object3D);
