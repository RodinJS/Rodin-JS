import {THREE} from '../../../three/THREE.GLOBAL.js';
import {Raycaster} from '../../raycaster/Raycaster.js';
import {EVENT_NAMES, KEY_CODES} from '../../constants/constants.js';
import {ErrorAbstractClassInstance} from '../../error/CustomErrors.js';
import {Event} from '../../Event.js';

export class GamePad extends THREE.Object3D {

    /**
     *
     * @param {string} navigatorGamePadId Required
     * @param {string, null} hand
     * @param {THREE.Scene} scene
     * @param {THREE.PerspectiveCamera, THREE.OrthographicCamera} camera
     * @param {number} raycastLayers
     * @todo: new.target safari problem
     */
    constructor(navigatorGamePadId = "", hand = null, scene = null, camera = null, raycastLayers = 1) {

        super();

        this.navigatorGamePadId = navigatorGamePadId;
        this.hand = hand;

        this.buttonsPressed = [false, false, false, false, false, false];
        this.buttonsTouched = [false, false, false, false, false, false];

        this.raycaster = new Raycaster();
        this.raycaster.setScene(scene);
        this.camera = camera;
        this.raycastLayers = raycastLayers;
        this.intersected = [];
        this.tempMatrix = new THREE.Matrix4();
        this.matrixAutoUpdate = false;
        this.standingMatrix = new THREE.Matrix4();
        this.engaged = false;

        this.buttons = [
            KEY_CODES.KEY1,
            KEY_CODES.KEY2,
            KEY_CODES.KEY3,
            KEY_CODES.KEY4,
            KEY_CODES.KEY5,
            KEY_CODES.KEY6
        ];
    }

    /**
     * get controller from navigator
     * @param {string} id
     * @param {string, null} hand
     * @returns {Object} controller or null
     */
    static getControllerFromNavigator(id, hand = null) {
        let controllers = navigator.getGamepads();
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
     * get mouse controller event
     * @param {string} id
     * @returns {Object} controller or null
     */
    static MouseControllerEvent(id){
        let mouseEvent = new MouseEvent("move", {
            bubbles: true,
            cancelable: true,
            view: window
        });

        return mouseEvent;
    }

    /**
     * Set scene for raycaster
     *
     * @param {THREE.Scene} scene
     */
    setRaycasterScene(scene) {
        this.raycaster.setScene(scene);
    }

    /**
     * Set camera for raycaster
     *
     * @param {THREE.PerspectiveCamera, THREE.OrthographicCamera} camera
     */
    setRaycasterCamera(camera) {
        this.camera = camera;
    }

    /**
     * All logic goes here
     */
    update() {
        let controller;
        //console.log(this.navigatorGamePadId);
        if (this.navigatorGamePadId !== "mouse") {
            controller = GamePad.getControllerFromNavigator(this.navigatorGamePadId, this.hand);
            if (!controller) {
                return console.warn(`Controller by id ${this.navigatorGamePadId} not found`);
            }

            console.log(controller.buttons.length);

            for (let i = 0; i < controller.buttons.length; i++) {

                // Handle controller button pressed event
                // Vibrate the gamepad using to the value of the button as
                // the vibration intensity.
                if (this.buttonsPressed[i] !== controller.buttons[i].pressed) {
                    controller.buttons[i].pressed ? this.onKeyDown(this.buttons[i]) : this.onKeyUp(this.buttons[i]);
                    this.buttonsPressed[i] = controller.buttons[i].pressed;

                    if ("haptics" in controller && controller.haptics.length > 0) {
                        if (controller.buttons[i]) {
                            controller.haptics[0].vibrate(controller.buttons[i].value, 50);
                            break;
                        }
                    }
                }

                // Handle controller button touch event
                // Vibrate the gamepad using to the value of the button as
                // the vibration intensity.
                if (this.buttonsTouched[i] !== controller.buttons[i].touched) {
                    controller.buttons[i].touched ? this.onTouchDown(this.buttons[i], controller) : this.onTouchUp(this.buttons[i], controller);
                    this.buttonsTouched[i] = controller.buttons[i].touched;
                }

                if (controller.buttons[i].touched) {
                    this.onTouchDown(this.buttons[i], controller);
                }
            }
            this.updateObject(controller);
        }
            this.intersectObjects();
    }

    /**
     * update controller object in scene, update position and rotation
     * @param {Object} controller
     */
    updateObject(controller) {
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
    intersectObjects() {
        if (!this.getIntersections) {
            console.warn(`getIntersections method is not defined`);
        }

        if (this.engaged)return;
        let intersections = this.getIntersections();

        if (intersections.length > 0) {
            if (intersections.length > this.raycastLayers) {
                intersections.splice(this.raycastLayers, (intersections.length - this.raycastLayers));
            }
        }

        this.intersected.map(intersect => {
            let found = false;
            for (let int = 0; int < intersections.length; int++) {
                if (intersections[int].object.Sculpt === intersect) {
                    found = true;
                }
            }
            if (!found) {
                this.gamepadHoverOut();
                intersect.emit(EVENT_NAMES.CONTROLLER_HOVER_OUT, this);
            }
        });

        this.intersected = [];

        if (intersections.length > 0) {
            intersections.map(intersect => {
                let evt = new Event(intersect.object.Sculpt);
                evt.distance = intersect.distance;
                this.intersected.push(intersect.object.Sculpt);
                this.gamepadHover(intersect);
                intersect.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_HOVER, evt, this);
            });
        }
    }

    /**
     * @param {string} eventName
     * @param {*} DOMEvent
     * @param {number} keyCode
     * @param {null} controller
     */
    raycastAndEmitEvent(eventName, DOMEvent, keyCode, controller = null) {
        if (this.intersected && this.intersected.length > 0) {
            this.intersected.map(intersect => {
                let evt = new Event(intersect.object3D.Sculpt, DOMEvent, keyCode, this.hand);
                evt.distance = intersect.distance;
                intersect.object3D.Sculpt.emit(eventName, evt, controller);
            });
        }
    }


    /**
     * @param {number} keyCode
     */
    onKeyDown(keyCode) {
    }

    /**
     * @param {number} keyCode
     */
    onKeyUp(keyCode) {
    }

    /**
     * @param {number} keyCode
     * @param {object} gamepad
     */
    onTouchDown(keyCode, gamepad) {
    }

    /**
     * @param {number} keyCode
     * @param {object} gamepad
     */
    onTouchUp(keyCode, gamepad) {
    }

    gamepadHover(intersect){
    }

    gamepadHoverOut(){
    }
}