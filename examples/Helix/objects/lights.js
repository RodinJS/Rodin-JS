import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';

const scene = SceneManager.get();

// export const ambientLight = new THREE.AmbientLight(0xffffff, .1);
export const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(0,1,0);

// scene.add(ambientLight);
scene.add(directionalLight);
