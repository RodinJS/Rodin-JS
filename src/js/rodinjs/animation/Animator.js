import {Animation} from './Animation.js';
import {ErrorParameterTypeDontMatch} from '../error/CustomErrors.js';
import {Set} from '../utils/Set.js';

export class Animator {
    constructor (sculpt) {
        this.sculpt = sculpt;
        this.clips = new Set();
    }

    /**
     * Get clip by name or index
     * @param getter
     * @returns {*}
     */
    getClip (getter) {
        if (Number.isInteger(getter)) {
            return this.clips[getter];
        }

        for (let i = 0; i < this.clips.length; i++) {
            if (this.clips[i].name === getter) {
                return this.clips[i];
            }
        }

        return null;
    }

    /**
     * Add new animation clip to animator
     * @param animation
     * @returns {Animation}
     */
    add (animation) {
        if (animation instanceof Animation) {
            this.clips.push(animation);
            animation.sculpt = this.sculpt;
            return animation;
        }

        throw new ErrorParameterTypeDontMatch('animation', 'Animation');
    }

    /**
     * Get all current clips
     * @returns {Set}
     */
    getClips () {
        return this.clips;
    }

    /**
     * Check if animator busy
     * @param getter
     * @returns {boolean}
     */
    isPlaying (getter = null) {
        if (getter === null) {
            for (let i = 0; i < this.clips.length; i++) {
                if (this.clips[i].isPlaying()) {
                    return true;
                }
            }

            return false;
        }

        return this.getClip(getter).isPlaying();
    }
}