import {Animation} from './Animation.js';
import {ErrorParameterTypeDontMatch} from '../error/CustomErrors.js';
import {Set} from '../utils/Set.js';

/**
 * Class Animator
 * Each Sculpt object have its own animator.
 * @param {!Sculpt} sculpt - Sculpt object
 */
export class Animator {
    constructor (sculpt) {

        /**
         * The host Sculpt object.
         * @type {Sculpt}
         */
        this.sculpt = sculpt;

        /**
         * Set of clips (animations) to be played.
         * @type {Set.<Animation>}
         */
        this.clips = new Set();
    }

    /**
     * Get clip by name or index
     * @param {!*} key
     * @returns {Animation}
     */
    getClip (key) {
        if (Number.isInteger(key)) {
            return this.clips[key];
        }

        for (let i = 0; i < this.clips.length; i++) {
            if (this.clips[i].name === key) {
                return this.clips[i];
            }
        }

        return null;
    }

    /**
     * Add new animation clip to animator
     * @param {...Animation}
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
     * @returns {Set.<Animation>}
     */
    getClips () {
        return this.clips;
    }

    /**
     * Check if animator is busy
     * @param {*} [key] -  check the state for a specific animation/clip
     * @returns {boolean}
     */
    isPlaying (key = null) {
        if (key === null) {
            for (let i = 0; i < this.clips.length; i++) {
                if (this.clips[i].isPlaying()) {
                    return true;
                }
            }

            return false;
        }

        return this.getClip(key).isPlaying();
    }

    /**
     * Start animation by name or id
     * @param {!*} key - Animation name or id
     * @param {boolean} [forceStart] - kills this animation (if currently playing) and starts again
     * @returns {boolean}
     */
    start (key, forceStart = false) {
        let clip = this.getClip(key);

        if (!clip) {
            return false;
        }

        return clip.start(forceStart);
    }

    /**
     * Stop animation by name or id
     * @param {!*} key - Animation name or id
     * @param {boolean} [reset] - run animation.reset() method after stopping the animation.
     * @returns {boolean} - success
     */
    stop (key, reset = true) {
        let clip = this.getClip(key);

        if (!clip) {
            return false;
        }

        return clip.stop(reset);
    }
}