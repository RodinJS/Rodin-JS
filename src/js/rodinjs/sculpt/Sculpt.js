import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import {WTF} from '../logger/Logger.js';
import {Objects} from '../objects.js';
import {ANIMATION_TYPES} from '../constants/constants.js';
import {TWEEN} from '../Tween.js';
import {EVENT_NAMES} from '../constants/constants.js';
import {ErrorAbstractClassInstance} from '../error/CustomErrors';

/**
 * Abstract class Sculpt
 */
export class Sculpt {
    constructor(id) {
        if (this.constructor == Sculpt) {
            throw new ErrorAbstractClassInstance();
        }

        /**git
         * private properties
         */

        this.id = id;
        let events = {};
        this.getEvents = () => events;

        this.isHovered = false;
        this.isPressed = false;
        this.isTouched = false;
        this.isMouseOvered = false;
        this.busy = false;
        this.locked = false;
        this.lockedBy = undefined;
        this.isSculpt = true;
        this.object3D = null;
        /**
         * this future is responsible for mouse and tap actions
         * If true, then all mouse and tap actions called on object will called on parent too.
         * If false, then event will stop here.
         *
         * NODE: Dont change value here, only change value for custom objects, derived from this class
         *
         *
         */
        this.passActionToParent = true;

        this.mouseX = 0;
        this.mouseY = 0;
        this.touchX = 0;
        this.touchY = 0;

        let touchStartTime = 0;
        let keyDownStartTime = {};

        this.style = {
            cursor: "default"
        };


        /**
         * HOVER ACTIONS
         * use isHovered flag for check if object is hovered
         */
        this.on(EVENT_NAMES.HOVER, () => {
            this.isHovered = true;
        });

        this.on(EVENT_NAMES.HOVER_OUT, () => {
            this.isHovered = false;
        });

        /**
         * MOUSE ACTIONS
         *
         * use isPressed flag for check if object is pressed
         * mousedown actions calls when you mousedown on object, and mouseup action calls only when you mouseup,
         * so please note, that when you mousedown on object and start dragging outside of object, mousemove event will
         * emitted on object
         *
         * if delay between mousedown and mouseup actions is less, then emits click event
         */
        this.on(EVENT_NAMES.MOUSE_DOWN, () => {
            this.isPressed = true;
            touchStartTime = Date.now();
        });

        this.on(EVENT_NAMES.MOUSE_UP, (evt) => {
            this.isPressed = false;
            if (Date.now() - touchStartTime < 200) {
                this.emit(EVENT_NAMES.CLICK, evt);
            }
            touchStartTime = 0;
        });

        this.on(EVENT_NAMES.MOUSE_ENTER, () => {
            this.isMouseOvered = true;
        });

        this.on(EVENT_NAMES.MOUSE_LEAVE, () => {
            this.isMouseOvered = false;
        });

        /**
         * STEREO MODE MOUSE ACTIONS
         *
         * same MOUSE ACTIONS logic
         */
        this.on(EVENT_NAMES.STEREO_MOUSE_DOWN, () => {
            touchStartTime = Date.now();
        });

        this.on(EVENT_NAMES.STEREO_MOUSE_UP, (evt) => {
            if (Date.now() - touchStartTime < 200) {
                this.emit(EVENT_NAMES.STEREO_CLICK, evt);
            }
            touchStartTime = 0;
        });

        /**
         * CONTROLLER KEY ACTIONS
         *
         * same MOUSE ACTIONS logic
         */
        this.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            keyDownStartTime[evt.keyCode] = Date.now();
        });

        this.on(EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
            if (Date.now() - keyDownStartTime[evt.keyCode] < 300) {
                this.emit(EVENT_NAMES.CONTROLLER_CLICK, evt);
            }
            keyDownStartTime[evt.keyCode] = 0;
        });

        /**
         * CONTROLLER TOUCH ACTIONS
         *
         * same MOUSE ACTIONS logic
         */
        this.on(EVENT_NAMES.CONTROLLER_TOUCH_START, (evt) => {
            keyDownStartTime[evt.keyCode] = Date.now();
        });

        this.on(EVENT_NAMES.CONTROLLER_TOUCH_END, (evt) => {
            if (Date.now() - keyDownStartTime[evt.keyCode] < 300) {
                this.emit(EVENT_NAMES.CONTROLLER_TAP, evt);
            }
            keyDownStartTime[evt.keyCode] = 0;
        });

        /**
         * TOUCH ACTIONS
         *
         * same MOUSE ACTIONS logic
         */
        this.on(EVENT_NAMES.TOUCH_START, () => {
            this.isTouched = true;
            touchStartTime = Date.now();
        });

        this.on(EVENT_NAMES.TOUCH_END, (evt) => {
            this.isTouched = false;
            if (Date.now() - touchStartTime < 200) {
                this.emit(EVENT_NAMES.TAP, evt);
            }
            touchStartTime = 0;
        });


        /**
         * CLICK ACTIONS
         */
        this.on(EVENT_NAMES.CLICK, (evt) => {
            if (evt.domEvent && evt.domEvent.which === 3) {
                this.emit(EVENT_NAMES.RIGHT_CLICK, evt);
            }
        });

        this.on("rightclick", (evt) => {
            WTF.is(evt.target);
        });
    }

    /**
     * init
     */
    init(object3D) {
        this.object3D = object3D;
        this.object3D.Sculpt = this;
        Objects.push(this);
    }

    /**
     * add listener to Event Alias
     * @param evts
     * @param callback
     */
    on(evts, callback) {
        let events = this.getEvents();
        if(!Array.isArray(events)) {
            evts = [evts];
        }
        for (let i = 0; i < evts.length; i++) {
            let evt = evts[i];
            if (!events[evt]) {
                events[evt] = [callback];
            } else if (events[evt].indexOf(callback) === -1) {
                events[evt].push(callback);
            }
        }
    }


    /**
     * add listener to Event Alias
     * @param evts
     * @param callback
     */
    addEventListener(evts, callback) {
        this.on(evts, callback);
    }

    /**
     * remove specific listener from Event Alias
     * @param evt
     * @param callback
     */
    removeEventListener(evt, callback) {
        let events = this.getEvents();
        let i = events[evt].indexOf(callback);
        if (events[evt] && i !== -1) {
            events[evt].splice(i, 1);
        }
    }

    /**
     * emit Event Alias with params
     * @param {String} evt
     * @param {Event} customEvt
     * @param {Array} args
     */
    emit(evt, customEvt, ...args) {
        let events = this.getEvents();
        if (events[evt] && events[evt].length > 0) {
            for (let f = 0; f < events[evt].length; f++) {
                if (typeof events[evt][f] === "function") {
                    events[evt][f].apply((customEvt && customEvt.target), [customEvt].concat(args));
                }
            }
        }
    }


    /**
     * remove all listeners from Event Alias
     * @param {Event} evt
     */
    removeAllListeners(evt) {
        let events = this.getEvents();
        if (events[evt]) {
            delete events[evt];
        }
    }

    /**
     * get global position of object
     * @returns {THREE.Vector3}
     */
    globalPosition() {
        return new THREE.Vector3().setFromMatrixPosition(this.object3D.matrixWorld);
    }

    /**
     * animate
     * @param {Object} params
     * @param next
     */
    animate(params, next) {
        if (!params.to) {
            throw new Error("Invalid end valus");
        }

        var easing = params.easing || TWEEN.Easing.Linear.None;
        var duration = params.duration || 200;
        var delay = params.delay || 0;
        var animateProperty = params.property;

        var startValue = params.from;
        var endValue = params.to;

        var onCompleteCallback = function () {
            next && next();
        };

        let object = this.object3D;
        if (animateProperty === ANIMATION_TYPES.SCALE) {
            if (!startValue) {
                startValue = new THREE.Vector3().copy(this.object3D.scale)
            }

            if (this.scaleTween) {
                this.scaleTween.stop();
            }

            var updateCallback = function () {
                object.scale.copy(this);
            };

            this.scaleTween = new TWEEN.Tween(startValue)
                .to(endValue, duration)
                .delay(delay)
                .onUpdate(updateCallback)
                .easing(easing)
                .start()
                .onComplete(onCompleteCallback);
        }

        if (animateProperty === ANIMATION_TYPES.POSITION) {
            if (!startValue) {
                startValue = new THREE.Vector3().copy(this.object3D.position)
            }

            if (this.positionTween) {
                this.positionTween.stop();
            }

            var updateCallback = function () {
                object.position.copy(this);
            };

            this.positionTween = new TWEEN.Tween(startValue)
                .to(endValue, duration)
                .delay(delay)
                .onUpdate(updateCallback)
                .easing(easing)
                .start()
                .onComplete(onCompleteCallback);
        }

        if (animateProperty === ANIMATION_TYPES.ROTATION) {
            if (!startValue) {
                startValue = new THREE.Vector3().copy(this.object3D.rotation)
            }

            if (this.rotationTween) {
                this.rotationTween.stop();
            }

            var updateCallback = function () {
                object.rotation.x = this.x;
                object.rotation.y = this.y;
                object.rotation.z = this.z;
            };

            this.rotationTween = new TWEEN.Tween(startValue)
                .to(endValue, duration)
                .delay(delay)
                .onUpdate(updateCallback)
                .easing(easing)
                .start()
                .onComplete(onCompleteCallback);
        }

        return this;
    }

    /**
     * rotate around center
     * @param {Object} params
     * @param next
     */
    rotateAroundNull(params, next) {
        var duration = params.duration || 500;
        var delay = params.delay || 0;
        var easing = params.easing || TWEEN.Easing.Quadratic.InOut;
        var cycles = params.cycles || 1;

        if (this.rotateTween) {
            this.rotateTween.stop()
        }

        var elem = {
            t: 0
        };

        var r = Math.sqrt(Math.pow(this.object3D.position.x, 2) + Math.pow(this.object3D.position.y, 2));

        let object = this.object3D;

        function updateCallback() {
            var t = this.t;

            object.position.y = r * Math.cos(t);
            object.position.x = r * Math.sin(t);
        }

        this.rotateTween = new TWEEN.Tween(elem)
            .to({t: 2 * cycles * Math.PI}, duration)
            .delay(delay)
            .onUpdate(updateCallback)
            .easing(easing)
            .start()
            .onComplete(next);
    }
}
