import {TWEEN} from '../Tween.js';
import {Event} from '../Event.js';
import {EVENT_NAMES} from '../constants/constants.js';

export class Animation {
    constructor (name, params) {
        this._loop  = false;
        this.sculpt = {};
        this.params = Object.clone(params);
        this.name = name;
        this._duration = 2000;
        this._delay = 0;
        this._easing = TWEEN.Easing.Linear.None;

        this.playing = false;
    }

    /**
     * copy animation
     * @returns {Animation}
     */
    copy () {
        let newAnimation = new Animation(this.name, this.params);
        return newAnimation.duration(this.duration()).easing(this.easing()).delay(this.delay()).loop(this.loop());
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

        let normalizedParams = Animation.normalizeParams(this.params, this.sculpt.object3D);
        let startValues = normalizedParams.from;
        let endValues = normalizedParams.to;

        this.playing = true;
        this.initialProps = Object.clone(startValues);
        let _this = this;
        this.tween = new TWEEN.Tween(startValues)
            .to(endValues, this._duration)
            .delay(this._delay)
            .onStart(function () {
                let evt = new Event(_this.sculpt);
                evt.animation = _this.name;
                _this.sculpt.emit(EVENT_NAMES.ANIMATION_START, evt);
            })
            .onUpdate(function () {
                for (let i in this) {
                    Object.setProperty(_this.sculpt.object3D, i, this[i]);
                }
            })
            .easing(this._easing)
            .start()
            .onComplete(function () {
                if (_this._loop ) {
                    _this.playing = false;
                    _this.reset();
                    _this.start();
                } else {
                    _this.playing = false;
                    delete this.tween;
                }

                let evt = new Event(_this.sculpt);
                evt.animation = _this.name;
                _this.sculpt.emit(EVENT_NAMES.ANIMATION_COMPLETE, evt);
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
            this.playing = false;

            if (reset) {
                this.reset();
            }

            let evt = new Event(this.sculpt);
            evt.animation = this.name;
            this.sculpt.emit(EVENT_NAMES.ANIMATION_STOP, evt);
            return true;
        }

        return false;
    }

    /**
     * reset all initial props
     */
    reset () {
        for (let i in this.initialProps) {
            Object.setProperty(this.sculpt.object3D, i, this.initialProps[i]);
        }
    }

    /**
     * Check animation playing status
     * @returns {boolean}
     */
    isPlaying () {
        return this.playing;
    }

    /**
     * Set loop
     * @param loop
     * @returns {Animation}
     */
    loop (loop = null) {
        if (loop === null) {
            return this._loop ;
        }

        this._loop  = loop;
        return this;
    }

    /**
     * Set duration
     * @param duration
     * @returns {Animation}
     */
    duration (duration = null) {
        if (duration === null) {
            return this._duration;
        }

        this._duration = duration;
        return this;
    }

    /**
     * Set delay
     * @param delay
     * @returns {Animation}
     */
    delay (delay = null) {
        if (delay === null) {
            return this._delay;
        }

        this._delay = delay;
        return this;
    }

    /**
     * Set easing
     * @param easing
     * @returns {Animation}
     */
    easing (easing = null) {
        if (easing === null) {
            return this._easing;
        }

        this._easing = easing;
        return this;
    }


    /**
     * Set sculpt
     * @param sculpt {Sculpt}
     * @returns {Animation}
     */
    setSculpt (sculpt) {
        this.initialProps = {};
        this.sculpt = sculpt;
        return this;
    }

    /**
     * Converts animation parameters to normalized
     * parameters containing {from: , to: }
     * @param {Object} params
     * @param {Sculpt} obj
     * @return {Object} normalized params
     */
    static normalizeParams (params, obj) {
        let _params = Object.joinParams(params, ['from', 'to']);
        let res = { from: {}, to: {} };
        for (let i in _params) {
            if (_params[i].hasOwnProperty('from')) {
                res.from[i] = _params[i].from;
                res.to[i] = _params[i].to;
            }
            else {
                res.from[i] = Object.getProperty(obj, i);
                res.to[i] = _params[i];
            }
        }
        return res;
    }
}
