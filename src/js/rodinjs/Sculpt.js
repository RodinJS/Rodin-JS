import {THREE} from '../three/THREE.GLOBAL.js';
import {WTF} from './logger/Logger.js';

export class Sculpt {
    constructor() {
        /**
         * private properties
         */
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
         * @type {boolean} passActionToParent
         */
        this.passActionToParent = true;

        this.mouseX = 0;
        this.mouseY = 0;
        this.touchX = 0;
        this.touchY = 0;

        let touchStartTime = 0;

        this.style = {
            cursor: "default"
        };


        /**
         * HOVER ACTIONS
         * use isHovered flag for check if object is hovered
         */
        this.on("hover", () => {
            this.isHovered = true;
        });

        this.on("hoverout", () => {
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
        this.on("mousedown", (evt) => {
            this.isPressed = true;
            touchStartTime = Date.now();
        });

        this.on("mouseup", (evt) => {
            this.isPressed = false;
            if (Date.now() - touchStartTime < 200) {
                this.emit("click", evt);
            }
            touchStartTime = 0;
        });

        this.on("mouseenter", (evt) => {
            this.isMouseOvered = true;
        });

        this.on("mouseleave", (evt) => {
            this.isMouseOvered = false;
        });

        /**
         * STEREO MODE MOUSE ACTIONS
         *
         * same MOUSE ACTIONS logic
         */
        this.on("stereomousedown", (evt) => {
            touchStartTime = Date.now();
        });

        this.on("stereomouseup", (evt) => {
            if (Date.now() - touchStartTime < 200) {
                this.emit("stereoclick", evt);
            }
            touchStartTime = 0;
        });

        /**
         * TOUCH ACTIONS
         *
         * same MOUSE ACTIONS logic
         */
        this.on("touchstart", (evt) => {
            this.isTouched = true;
            touchStartTime = Date.now();
        });

        this.on("touchend", (evt) => {
            this.isTouched = false;
            if (Date.now() - touchStartTime < 200) {
                this.emit("tap", evt);
            }
            touchStartTime = 0;
        });


        /**
         * CLICK ACTIONS
         */
        this.on("click", (evt) => {
            if (evt.domEvent && evt.domEvent.which === 3) {
                this.emit("rightclick", evt);
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
    }

    /**
     * add listener to Event Alias
     * @param evts
     * @param callback
     */
    on(evts, callback) {
        let events = this.getEvents();
        evts = evts.split(" ").map((evt) => {
            return evt.trim();
        });
        for (let i = 0; i < evts.length; i++) {
            let evt = evts[i];
            if (!this.events[evt]) {
                this.events[evt] = [callback];
            } else if (this.events[evt].indexOf(callback) === -1) {
                this.events[evt].push(callback);
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
     * @param evt
     * @param param
     */
    emit(evt, param) {
        let events = this.getEvents();
        if (events[evt] && events[evt].length > 0) {
            for (let f = 0; f < events[evt].length; f++) {
                if (typeof events[evt][f] === "function")
                    events[evt][f](param);
            }
        }
    }


    /**
     * remove all listeners from Event Alias
     * @param evt
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
}
