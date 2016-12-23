import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';
import {ModelLoader} from '../../../_build/js/rodinjs/sculpt/ModelLoader.js';

const scene = SceneManager.get();

export const platform = ModelLoader.load('./models/platform/mountain.JD');

platform.on('ready', () => {
    console.log('ready');
    scene.add(platform.object3D);
});
