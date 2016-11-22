import {TWEEN} from '../Tween.js';

export class Animation {
    constructor (params) {
        this.loop = false;
        this.playing = false;
        this.duration = 500;
        this.sculpt = {};
        this.params = params;
        this.duration = 500;
        this.delay = 0;
        this.easing = TWEEN.Easing.Elastic.Out;
    }

    /**
     * Start animation
     * @param forceStart {boolean}
     * @returns {boolean}
     */
    start (forceStart = false) {
        if (!this.sculpt.isSculpt) {
            return console.warn('animation cannot be played without adding in object');
        }

        if (this.isPlaying()) {
            if (forceStart) {
                this.stop();
                this.start();
                return true;
            } else {
                return false;
            }
        }

        let startValues = {};
        let endValues = {};
        // todo: find mardavari dzev for this
        for (let i in this.params) {
            if (Object.getProperty(this.sculpt, i) !== undefined) {
                startValues[i] = Object.getProperty(this.sculpt, i);
                endValues[i] = this.params[i];
            }
        }

        this.playing = true;
        let sculpt = this.sculpt;
        this.tween = new TWEEN(startValues)
            .to(endValues, this.duration)
            .delay(this.delay)
            .onUpdate(function () {
                for (let i in this) {
                    Object.setProperty(sculpt, i, this[i]);
                }
            })
            .easing(this.easing)
            .start()
            .onComplete(function () {
                delete this.tween;
                this.playing = false;

                if (this.loop) {
                    this.start();
                }
            });
    }

    /**
     * Start animation
     * @param forceStart {boolean}
     * @returns {boolean}
     */
    play (forceStart = false) {
        return this.start(forceStart);
    }

    /**
     * Stop animation
     */
    stop () {
        if (this.isPlaying()) {
            this.tween.stop();
            delete this.tween;
            return true;
        }

        return false;
    }

    /**
     * Check animation playing status
     * @returns {boolean}
     */
    isPlaying () {
        return !!this.tween;
    }

    /**
     * Set loop
     * @param loop {boolean}
     */
    loop (loop) {
        this.loop = loop
    }

    setSculpt (sculpt) {
        this.sculpt = sculpt;
    }
}
