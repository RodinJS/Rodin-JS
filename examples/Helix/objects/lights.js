import {THREE} from '../../../_build/js/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';

const scene = SceneManager.get();

export const ambientLight = new THREE.AmbientLight();
export const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

scene.add(ambientLight);
scene.add(directionalLight);
