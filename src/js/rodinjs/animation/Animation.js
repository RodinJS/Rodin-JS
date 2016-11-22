import {TWEEN} from '../Tween.js';

export class Animation {
    constructor (params, name) {
        this.isLooping = false;
        this.sculpt = {};
        this.params = params;
        this.name = name;
        this.duration = 3000;
        this.delay = 0;
        this.easing = TWEEN.Easing.Linear.None;
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
            if (Object.getProperty(this.sculpt.object3D, i) !== undefined) {
                if (this.params[i].from) {
                    startValues[i] = this.params[i].from;
                    endValues[i] = this.params[i].to;
                } else {
                    startValues[i] = Object.getProperty(this.sculpt.object3D, i);
                    endValues[i] = this.params[i];
                }
            }
        }

        console.log(startValues);
        console.log(endValues);

        this.initialProps = Object.clone(startValues);
        let _this = this;
        this.tween = new TWEEN.Tween(startValues)
            .to(endValues, this.duration)
            .delay(this.delay)
            .onUpdate(function () {
                for (let i in this) {
                    Object.setProperty(_this.sculpt.object3D, i, this[i]);
                }
            })
            .easing(this.easing)
            .start()
            .onComplete(function () {
                if (_this.isLooping) {
                    _this.stop();
                    _this.start();
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
    stop (reset = true) {
        if (this.isPlaying()) {
            this.tween.stop();
            delete this.tween;

            if (reset) {
                for (let i in this.initialProps) {
                    Object.setProperty(this.sculpt.object3D, i, this.initialProps[i]);
                }
            }
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
        this.isLooping = loop;
        return this;
    }

    setSculpt (sculpt) {
        this.sculpt = sculpt;
    }
}
