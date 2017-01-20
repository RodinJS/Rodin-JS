import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

const scene = SceneManager.get();

const intensity = 0.25;
const lightColor = 0xfff5eb;
const geometry = new THREE.SphereGeometry(0.05, 10, 10);
const material = new THREE.MeshBasicMaterial({color: lightColor});
const x = 1.87;
const y = 2.86;
const zL = 2.77;
const zR = 1.45;

// Add ambient lights
export const ambientLight = new THREE.AmbientLight(0xd9d9d9, intensity);
scene.add(ambientLight);

// Add directional lights
export const lights = [];
let light;

for (let i = 0; i < 8; i++) {

    light = new THREE.DirectionalLight(lightColor, intensity);
    light.add(new THREE.Mesh(geometry, material));

    scene.add(light);
    lights.push(light);
}

lights[0].position.set(x - 0.75, y, zL);

lights[1].position.set(x, y, -zR);

lights[2].position.set(x, y, zR);

lights[3].position.set(x, y, -zL);

lights[4].position.set(-x, y, zR);

lights[5].position.set(-x, y, zL);

lights[6].position.set(-x, y, -zR);

lights[7].position.set(-x, y, -zL);

