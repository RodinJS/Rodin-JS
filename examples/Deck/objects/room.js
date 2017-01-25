import {ModelLoader} from '../../../_build/js/rodinjs/sculpt/ModelLoader.js';
import {SceneManager} from '../../../_build/js/rodinjs/scene/SceneManager.js';

const scene = SceneManager.get();

export const room = ModelLoader.load('./models/room/room.json');

room.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.scale.set(.0035, .0035, .0035);
});
