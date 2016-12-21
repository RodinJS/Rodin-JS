import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import {Objects, Raycastables} from '../objects.js';
import {ANIMATION_TYPES} from '../constants/constants.js';
import {TWEEN} from '../Tween.js';
import {Animator} from '../animation/Animator.js';
import {ErrorAbstractClassInstance, ErrorProtectedMethodCall} from '../error/CustomErrors';

/**
 * this function allows that only sculpt can add native event listeners
 */
function Enforce () {
}

/**
 * Abstract class Sculpt
 */
export class Sculpt {
    constructor (id) {
        if (this.constructor == Sculpt) {
            throw new ErrorAbstractClassInstance();
        }

        this.id = id;
        let events = {};
        this.getEvents = () => events;

        let nativeEvents = {};
        this.getNativeEvents = (enforce) => {
            if (enforce !== Enforce) {
                throw new ErrorProtectedMethodCall('getNativeEvents');
            }

            return nativeEvents;
        };

        this.forceHover = false;
        this.locked = false;
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

        this.style = {
            cursor: "default"
        };

        this.animator = new Animator(this);
    }

    /**
     * init
     */
    init (object3D) {
        this.object3D = object3D;
        this.object3D.Sculpt = this;
        Objects.push(this);
    }

    /**
     * add listener to Event Alias
     * @param {string[]|string} evts
     * @param {function} callback
     * @param {function} enforce
     */
    on (evts, callback, enforce = null) {
        let events = enforce === Enforce ? this.getNativeEvents(enforce) : this.getEvents();
        if (!Array.isArray(evts)) {
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
    addEventListener (evts, callback) {
        this.on(evts, callback);
    }

    /**
     * remove specific listener from Event Alias
     * @param evt
     * @param callback
     */
    removeEventListener (evt, callback) {
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
    emit (evt, customEvt, ...args) {
        customEvt.name = evt;
        this.emitNative(evt, customEvt, Enforce);

        if (customEvt.propagation === false) {
            return;
        }

        let events = this.getEvents();
        if (events[evt] && events[evt].length > 0) {
            for (let f = 0; f < events[evt].length; f++) {
                if (typeof events[evt][f] === "function") {
                    events[evt][f].apply((customEvt && customEvt.target), [customEvt].concat(args));
                }
            }
        }
    }

    emitNative (evt, customEvt, enforce) {
        if (enforce !== Enforce) {
            throw  new ErrorProtectedMethodCall('emitNative')
        }

        let events = this.getNativeEvents(Enforce);
        if (events[evt] && events[evt].length > 0) {
            for (let f = 0; f < events[evt].length; f++) {
                if (typeof events[evt][f] === "function") {
                    events[evt][f].apply((customEvt && customEvt.target), [customEvt]);
                }
            }
        }
    }

    /**
     * remove all listeners from Event Alias
     * @param {Event} evt
     */
    removeAllListeners (evt) {
        let events = this.getEvents();
        if (events[evt]) {
            delete events[evt];
        }
    }

    /**
     * get global position of object
     * @returns {THREE.Vector3}
     */
    globalPosition () {
        return new THREE.Vector3().setFromMatrixPosition(this.object3D.matrixWorld);
    }
    /**
     * Sets the global matrix of the object
     * @param {THREE.Matrix4} matrix
     */
    setGlobalMatrix(matrix){
        let inverseParentMatrix = new THREE.Matrix4();
        let newGlobalMatrix = matrix.clone();

        inverseParentMatrix.getInverse(this.object3D.matrixWorld);
        newGlobalMatrix.multiplyMatrices(inverseParentMatrix, newGlobalMatrix);

        this.object3D.matrixAutoUpdate = false;
        this.object3D.matrix = newGlobalMatrix;
    }

    /**
     * animate
     * @param {Object} params
     * @param next
     */
    animate (params, next) {
        if (!params.to) {
            throw new Error("Invalid end valus");
        }

        let easing = params.easing || TWEEN.Easing.Linear.None;
        let duration = params.duration || 200;
        let delay = params.delay || 0;
        let animateProperty = params.property;

        let startValue = params.from;
        let endValue = params.to;

        let onCompleteCallback = function () {
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

            let updateCallback = function () {
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

            let updateCallback = function () {
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

            let updateCallback = function () {
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
    rotateAroundNull (params, next) {
        let duration = params.duration || 500;
        let delay = params.delay || 0;
        let easing = params.easing || TWEEN.Easing.Quadratic.InOut;
        let cycles = params.cycles || 1;

        if (this.rotateTween) {
            this.rotateTween.stop()
        }

        let elem = {
            t: 0
        };

        let r = Math.sqrt(Math.pow(this.object3D.position.x, 2) + Math.pow(this.object3D.position.y, 2));

        let object = this.object3D;

        function updateCallback () {
            let t = this.t;

            object.position.y = r * Math.cos(t);
            object.position.x = r * Math.sin(t);
        }

        this.rotateTween = new TWEEN.Tween(elem)
            .to({ t: 2 * cycles * Math.PI }, duration)
            .delay(delay)
            .onUpdate(updateCallback)
            .easing(easing)
            .start()
            .onComplete(next);
    }

    set raycastable(value) {
        if(value) {
            Raycastables.push(this.object3D);
        } else {
            Raycastables.remove(this.object3D);
        }
    }

    /**
     * get Objects forward vector
     * @returns {THREE.Vector3}
     */
    get forward () {
        return (new THREE.Vector3(0, 0, 1)).applyQuaternion(this.object3D.quaternion);
    }
}
