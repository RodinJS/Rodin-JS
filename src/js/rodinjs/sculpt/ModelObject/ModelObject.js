import {Sculpt} from '../Sculpt.js';
import {ErrorAbstractClassInstance} from '../../error/CustomErrors.js';

export class ModelObject extends Sculpt {
    constructor () {
        super();

        if(this.constructor === ModelObject) {
            throw new ErrorAbstractClassInstance();
        }

        this._mixers = [];
    }

    resolveMeshAnimations (mesh) {
        if (mesh.geometry.animations) {
            let mixer = new THREE.AnimationMixer(mesh);
            for (let i = 0; i < mesh.geometry.animations.length; i++) {
                const animation = mixer.clipAction(mesh.geometry.animations[i]);
                animation.name = mesh.geometry.animations[i].name;
                animation.setLoop(THREE.LoopOnce, 0);
                animation.isPlaying = animation.isRunning;
                this.animator.add(animation);
            }

            mixer.addEventListener('finished', e => {
                console.log(e);
            });

            this._mixers.push(mixer);
        }
    }
}
