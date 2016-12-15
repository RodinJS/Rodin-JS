import {Animation} from './Animation.js';
import {ErrorParameterTypeDontMatch} from '../error/CustomErrors.js';
import {Set} from '../utils/Set.js';

/**
 * Class Animator
 * Each Sculpt object have its own animator.
 */
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
     * @returns {Animation}
     */
    add () {
        for (let i = 0; i < arguments.length; i++) {
            let animation = arguments[i];
            if (!( animation instanceof Animation)) {
                throw new ErrorParameterTypeDontMatch('animation', 'Animation');
            }

            this.clips.push(animation.copy().setSculpt(this.sculpt));
        }
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

    /**
     * Start animation by name or id
     * @param getter {string|number}
     * @param forceStart {boolean}
     * @returns {boolean}
     */
    start (getter, forceStart = false) {
        let clip = this.getClip(getter);

        if (!clip) {
            return false;
        }

        return clip.start(forceStart);
    }

    /**
     * Stop animation by name or id
     * @param getter {string|number}
     * @returns {boolean}
     */
    stop (getter) {
        let clip = this.getClip(getter);

        if (!clip) {
            return false;
        }

        return clip.stop();
    }
}