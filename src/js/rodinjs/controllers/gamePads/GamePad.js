import {THREE} from '../../../vendor/three/THREE.GLOBAL.js';
import {Raycaster} from '../../raycaster/Raycaster.js';
import {EVENT_NAMES, KEY_CODES} from '../../constants/constants.js';
import {ErrorAbstractClassInstance, ErrorProtectedFieldChange} from '../../error/CustomErrors.js';
import {Event} from '../../Event.js';

import {MouseGamePad} from './MouseGamePad.js';
import {CardboardGamePad} from './CardboardGamePad.js';

let containsIntersect = function(interArray, inter){
    for(let i = 0; i < interArray.length; i++){
        let intersect = interArray[i];
        if(intersect.object.Sculpt === inter.object.Sculpt){
            return true;
        }
    }
    return false;
};

export class GamePad extends THREE.Object3D {

    /**
     *
     * @param {string} navigatorGamePadId Required
     * @param {string, null} hand
     * @param {THREE.Scene} scene
     * @param {THREE.PerspectiveCamera, THREE.OrthographicCamera} camera
     * @param {number} raycastLayers
     */
    constructor (navigatorGamePadId = "", hand = null, scene = null, camera = null, raycastLayers = 1) {

        super();

        navigator.mouseGamePad = MouseGamePad.getInstance();
        navigator.cardboardGamePad = CardboardGamePad.getInstance();
        this.navigatorGamePadId = navigatorGamePadId;
        this.hand = hand;

        this.raycaster = new Raycaster();
        this.raycaster.setScene(scene);
        this.camera = camera;
        this.raycastLayers = raycastLayers;
        this.intersected = [];
        this.tempMatrix = new THREE.Matrix4();
        this.matrixAutoUpdate = false;
        this.standingMatrix = new THREE.Matrix4();
        this.engaged = false;
        this.warningsFired = {};

        this.buttons = [
            KEY_CODES.KEY1,
            KEY_CODES.KEY2,
            KEY_CODES.KEY3,
            KEY_CODES.KEY4,
            KEY_CODES.KEY5,
            KEY_CODES.KEY6
        ];

        this.buttonsPressed = new Array(this.buttons.length).fill(false);
        this.buttonsTouched = new Array(this.buttons.length).fill(false);
        this.buttonsValues = new Array(this.buttons.length).fill(0);

        this.enabled = true;
    }

    enable () {
        this.enabled = true;
        this.onEnable();
    }

    disable () {
        this.enabled = false;
        this.onDisable();
    }

    /**
     * get controller from navigator
     * @param {string} id
     * @param {string, null} hand
     * @returns {Object} controller or null
     */
    static getControllerFromNavigator (id, hand = null) {
        let controllers = [];
        try {
            controllers = [...navigator.getGamepads()];

            /// TODO by Lyov: add static array like: customGamePads for remote add custom game pads without change GamePad class

            controllers.push(navigator.mouseGamePad);
            controllers.push(navigator.cardboardGamePad);
        } catch (ex) {
            controllers = [navigator.mouseGamePad, navigator.cardboardGamePad];
        }
        if (!controllers || !controllers.length || controllers[0] === undefined) {
            controllers = [navigator.mouseGamePad, navigator.cardboardGamePad];
        }
        for (let i = 0; i < controllers.length; i++) {
            let controller = controllers[i];
            if (controller && controller.id && controller.id.match(new RegExp(id, 'gi'))) {
                if (hand === null) {
                    return controller;
                } else {
                    if (controller.hand && controller.hand.match(new RegExp(hand, 'gi'))) {
                        return controller;
                    }
                }
            }
        }

        return null;
    }

    /**
     * Set scene for raycaster
     *
     * @param {THREE.Scene} scene
     */
    setRaycasterScene (scene) {
        this.raycaster.setScene(scene);
    }

    /**
     * Set camera for raycaster
     *
     * @param {THREE.PerspectiveCamera, THREE.OrthographicCamera} camera
     */
    setRaycasterCamera (camera) {
        this.camera = camera;
    }

    /**
     * Getter for GamePad axes.
     * @returns {Array} An array of double values
     */
    get axes () {
        return GamePad.getControllerFromNavigator(this.navigatorGamePadId, this.hand).axes;
    }

    /**
     * Checks the gamepad state, calls the appropriate methods
     */
    update () {
        if (!this.enabled)
            return;

        let controller = GamePad.getControllerFromNavigator(this.navigatorGamePadId, this.hand);

        if (!controller) {
            if(!this.warningsFired[this.navigatorGamePadId]){
                this.warningsFired[this.navigatorGamePadId] = true;
                console.warn(`Controller by id ${this.navigatorGamePadId} not found`);
            }
            return;
        }

        for (let i = 0; i < controller.buttons.length; i++) {

            // Handle controller button pressed event
            // Vibrate the gamepad using to the value of the button as
            // the vibration intensity.
            if (this.buttonsPressed[i] !== controller.buttons[i].pressed) {
                controller.buttons[i].pressed ? this.keyDown(this.buttons[i]) : this.keyUp(this.buttons[i]);
                this.buttonsPressed[i] = controller.buttons[i].pressed;
                if ("haptics" in controller && controller.haptics.length > 0) {
                    if (controller.buttons[i]) {
                        controller.haptics[0].vibrate(controller.buttons[i].value, 50);
                        break;
                    }
                }
            }

            // Handle controller button value change
            if (this.buttonsValues[i] !== controller.buttons[i].value) {
                this.valueChange(this.buttons[i]);
                this.buttonsValues[i] = controller.buttons[i].value;
            }

            // Handle controller button touch event
            // Vibrate the gamepad using to the value of the button as
            // the vibration intensity.
            if (this.buttonsTouched[i] !== controller.buttons[i].touched) {
                controller.buttons[i].touched ? this.touchDown(this.buttons[i], controller) : this.touchUp(this.buttons[i], controller);
                this.buttonsTouched[i] = controller.buttons[i].touched;
            }

            if (controller.buttons[i].touched) {
                this.onTouchDown(this.buttons[i], controller);
            }
        }

        this.onControllerUpdate();
        this.updateObject(controller);
        this.intersectObjects(controller);
    }

    /**
     * update controller object in scene, update position and rotation
     * @param {Object} controller
     */
    updateObject (controller) {
        if (controller.pose) {
            let pose = controller.pose;

            if (pose.position !== null) this.position.fromArray(pose.position);
            if (pose.orientation !== null) this.quaternion.fromArray(pose.orientation);
            this.matrix.compose(this.position, this.quaternion, this.scale);
            this.matrix.multiplyMatrices(this.standingMatrix, this.matrix);
            this.matrixWorldNeedsUpdate = true;
            this.visible = true;
        }
    }

    /**
     * Checks all intersect and emits hover and hoverout events
     */
    intersectObjects (controller) {
        if (!this.getIntersections) {
            console.warn(`getIntersections method is not defined`);
        }

        if (this.engaged)
            return;

        let intersections = this.getIntersections(controller);

        if (intersections.length > 0) {
            if (intersections.length > this.raycastLayers) {
                intersections.splice(this.raycastLayers, (intersections.length - this.raycastLayers));
            }
        }

        this.intersected.map(intersect => {
            let found = false;
            for (let int = 0; int < intersections.length; int++) {
                if (intersections[int].object.Sculpt === intersect.object.Sculpt) {
                    found = true;
                }
            }
            if (!found) {
                this.gamepadHoverOut();
                let evt = new Event(intersect.object.Sculpt, null, null, "", this);
                intersect.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_HOVER_OUT, evt);
            }
        });

        if (intersections.length > 0) {
            intersections.map(intersect => {
                if(!containsIntersect(this.intersected, intersect) || intersect.object.Sculpt.forceHover){
                    let evt = new Event(intersect.object.Sculpt, null, null, "", this);
                    evt.distance = intersect.distance;
                    evt.uv = intersect.uv;
                    this.gamepadHover(intersect);
                    intersect.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_HOVER, evt);
                }
            });
        }
        this.intersected = [...intersections];
    }

    /**
     * @param {string} eventName
     * @param {*} DOMEvent
     * @param {number} keyCode
     * @param {GamePad} controller
     */
    raycastAndEmitEvent (eventName, DOMEvent, keyCode, controller = null) {
        if (this.intersected && this.intersected.length > 0) {
            this.intersected.map(intersect => {
                let evt = new Event(intersect.object.Sculpt, DOMEvent, keyCode, this.hand, controller);
                evt.distance = intersect.distance;
                evt.uv = intersect.uv;
                intersect.object.Sculpt.emit(eventName, evt);
            });
        }
    }

    get valueChange () {
        return (keyCode) => {
            this.onValueChange && this.onValueChange(keyCode);
            this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_VALUE_CHANGE, null, keyCode, this);
        }
    }

    set valueChange (value) {
        throw new ErrorProtectedFieldChange('valueChange');
    }

    /**
     * @param {number} value
     */
    onValueChange (value) {
    }

    get keyDown () {
        return (keyCode) => {
            this.onKeyDown && this.onKeyDown(keyCode);
            this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_KEY_DOWN, null, keyCode, this);
        }
    }

    set keyDown (value) {
        throw new ErrorProtectedFieldChange('keyDown');
    }


    /**
     * @param {number} keyCode
     */
    onKeyDown (keyCode) {
    }


    get keyUp () {
        return (keyCode) => {
            this.onKeyUp && this.onKeyUp(keyCode);
            this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_KEY_UP, null, keyCode, this);
        }
    }

    set keyUp (value) {
        throw new ErrorProtectedFieldChange('keyUp');
    }

    /**
     * @param {number} keyCode
     */
    onKeyUp (keyCode) {
    }

    /**
     *
     */

    get touchDown () {
        return (keyCode, gamepad) => {
            this.onTouchDown && this.onTouchDown(keyCode, gamepad);
            this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_TOUCH_START, null, keyCode, this);
        }
    }

    set touchDown (value) {
        throw new ErrorProtectedFieldChange('touchDown');
    }

    /**
     * @param {number} keyCode
     * @param {object} gamepad
     */
    onTouchDown (keyCode, gamepad) {
    }


    get touchUp () {
        return (keyCode, gamepad) => {
            this.onTouchUp && this.onTouchUp(keyCode, gamepad);
            this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_TOUCH_END, null, keyCode, this);
        }
    }

    set touchDown (value) {
        throw new ErrorProtectedFieldChange('touchUp');
    }

    /**
     * @param {number} keyCode
     * @param {object} gamepad
     */
    onTouchUp (keyCode, gamepad) {
    }


    onDisable () {

    }

    onEnable () {

    }


    onControllerUpdate () {
    }

    gamepadHover (intersect) {
    }

    gamepadHoverOut () {
    }
}