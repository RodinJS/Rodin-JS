import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
import {Objects, Raycastables, LoadingObjects} from '../objects.js';
import {ANIMATION_TYPES} from '../constants/constants.js';
import {TWEEN} from '../Tween.js';
import {Animator} from '../animation/Animator.js';
import {ErrorAbstractClassInstance, ErrorProtectedMethodCall} from '../error/CustomErrors.js';
import {SceneManager} from '../scene/SceneManager.js';

/**
 * This function is used for restricting native event listeners creation only to sculpt
 */
function Enforce () {
}

/**
 * Abstract class Sculpt
 * <p>Sculpt is a wrapper for 3d objects (THREE.Object3D, THREE.Mesh) used in Rodin library.</p>
 * This wrapper allows adding event listeners to the 3d objects, animating, and adds other utilities.
 */
export class Sculpt {
    constructor (id) {
        if (this.constructor == Sculpt) {
            throw new ErrorAbstractClassInstance();
        }

        LoadingObjects.push(this);
        this.on('ready', () => {
            LoadingObjects.remove(this);
            if(LoadingObjects.length === 0) {
                SceneManager.loadingComplete();
            }
        });

        /**
         * Just an id.
         * @type {*}
         */
        this.id = id;
        let events = {};
        /**
         * Get all events for the sculpt objects
         * @return {Object<string, function[]>} - a map for event names and their listener function arrays
         */
        this.getEvents = () => events;

        let nativeEvents = {};
        this.getNativeEvents = (enforce) => {
            if (enforce !== Enforce) {
                throw new ErrorProtectedMethodCall('getNativeEvents');
            }

            return nativeEvents;
        };
        /**
         * Force hover event to be triggered on each animation frame, as long as the object is being hovered by a controller.
         * <p>By default (false) the hover event is triggered once, every time a controller hovers the object</p>
         * @type {boolean}
         */
        this.forceHover = false;

        /**
         * The THREE.Object3D object of this Sculpt object.
         * @type {THREE.Object3D}
         */
        this.object3D = null;

        /**
         * The animator of this object, responsible for animations management.
         * @type {Animator}
         */
        this.animator = new Animator(this);
    }

    /**
     * Initialize the sculpt object by setting its THREE.Object3D variable, and linking it to this sculpt instance.
     * We link 3d objects to their sculpt wrapper for cases when we have got the 3d element only (for example from raycaster) and need to find it's container sculpt object
     * @param {THREE.Object3D} object3D
     */
    init (object3D) {
        this.object3D = object3D;
        this.object3D.Sculpt = this;
        Objects.push(this);
    }

    /**
     * Add listener to Event.
     * @param {string[]|string} evts - event name(s)
     * @param {function} callback - callback function
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
     * Add listener to Event
     * @param {string[]|string} evts - event name(s)
     * @param {function} callback - callback function
     */
    addEventListener (evts, callback) {
        this.on(evts, callback);
    }

    /**
     * Remove specific listener from Event
     * @param {string} evt - event name
     * @param {function} callback - callback function
     */
    removeEventListener (eventName, callback) {
        let events = this.getEvents();
        let i = events[eventName].indexOf(callback);
        if (events[eventName] && i !== -1) {
            events[eventName].splice(i, 1);
        }
    }

    /**
     * Emit Event with params
     * @param {String} evtName
     * @param {Event} customEvt - a custom Event object
     * @param {Array} args - arguments to be passed to the event callback
     */
    emit (evtName, customEvt, ...args) {
        customEvt.name = evtName;
        this.emitNative(evtName, customEvt, Enforce);

        if (customEvt.propagation === false) {
            return;
        }

        let events = this.getEvents();
        if (events[evtName] && events[evtName].length > 0) {
            for (let f = 0; f < events[evtName].length; f++) {
                if (typeof events[evtName][f] === "function") {
                    events[evtName][f].apply((customEvt && customEvt.target), [customEvt].concat(args));
                }
            }
        }
    }

    emitNative (eventName, customEvt, enforce) {
        if (enforce !== Enforce) {
            throw  new ErrorProtectedMethodCall('emitNative')
        }

        let events = this.getNativeEvents(Enforce);
        if (events[eventName] && events[eventName].length > 0) {
            for (let f = 0; f < events[eventName].length; f++) {
                if (typeof events[eventName][f] === "function") {
                    events[eventName][f].apply((customEvt && customEvt.target), [customEvt]);
                }
            }
        }
    }

    /**
     * Remove all listeners from Event
     * @param {Event} eventName
     */
    removeAllListeners (eventName) {
        let events = this.getEvents();
        if (events[eventName]) {
            delete events[eventName];
        }
    }

    /**
     * Get global position of object
     * @returns {THREE.Vector3}
     */
    globalPosition () {
        return new THREE.Vector3().setFromMatrixPosition(this.object3D.matrixWorld);
    }

    /**
     * animate a parameter change
     * @param {Object} params - e.g.
        {
            property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
            from: new THREE.Vector3(1, 1, 1),
            to: new THREE.Vector3(1.1, 1.1, 1.1),
            easing: TWEEN.Easing.Linear.None,
            duration: 500,
            delay: 20,
        }
     * @param {function} next - onComplete callback function
     */
    animate (params, next) {
        if (!params.to) {
            throw new Error("Invalid end values");
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
     * Make object raycastable or not
     * @param {boolean} value
     */
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
