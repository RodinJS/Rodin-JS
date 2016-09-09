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
     */
    constructor(navigatorGamePadId = "", hand = null, scene = null, camera = null) {
        if (new.target === GamePad) {
            throw new ErrorAbstractClassInstance();
        }

        super();

        this.navigatorGamePadId = navigatorGamePadId;
        this.hand = hand;

        this.buttonsPressed = [false, false, false, false, false, false];
        this.buttonsTouched = [false, false, false, false, false, false];

        this.raycaster = new Raycaster();
        this.raycaster.setScene(scene);
        this.camera = camera;
        this.intersected = [];
        this.tempMatrix = new THREE.Matrix4();
        this.matrixAutoUpdate = false;
        this.standingMatrix = new THREE.Matrix4();

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
        let controller = GamePad.getControllerFromNavigator(this.navigatorGamePadId, this.hand);
        if (!controller) {
            return console.warn(`Controller by id ${this.navigatorGamePadId} not found`);
        }

        for (let i = 0; i < controller.buttons.length; i++) {
            if (this.buttonsPressed[i] !== controller.buttons[i].pressed) {
                controller.buttons[i].pressed ? this.onKeyDown(this.buttons[i]) : this.onKeyUp(this.buttons[i]);
                this.buttonsPressed[i] = controller.buttons[i].pressed;
            }

            if (this.buttonsTouched !== controller.buttons[i].touched) {
                controller.buttons[i].touched ? this.onTouchDown(this.buttons[i]) : this.onTouchUp(this.buttons[i]);
                this.buttonsTouched = controller.buttons[i].touched;
            }
        }

        this.intersectObjects();
        this.updateObject(controller);
    }

    /**
     * update controller object in scene, update position and rotation
     * @param {Object} controller
     */
    updateObject(controller) {
        if (controller.pose !== null) {
            var pose = controller.pose;

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
            console.warn(`getIntersections method is not overwritten`);
        }

        let intersections = this.getIntersections();

        this.intersected.map(i => {
            let found = false;
            for (let int = 0; int < intersections.length; int++) {
                if (intersections[int].object.Sculpt === i) {
                    found = true;
                }
            }

            if (!found) {
                i.emit(EVENT_NAMES.CONTROLLER_HOVER_OUT);
            }
        });

        this.intersected = [];

        if (intersections.length > 0) {
            intersections.map(intersect => {
                intersect.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_HOVER, new Event(intersect.object.Sculpt));
                this.intersected.push(intersect.object.Sculpt);
            });
        }
    }

    /**
     * @param {string} eventName
     * @param {*} DOMEvent
     * @param {number} keyCode
     */
    raycastAndEmitEvent(eventName, DOMEvent, keyCode) {
        if (!this.getIntersections) {
            console.warn(`getIntersections method is not overwritten`);
        }

        var intersections = this.getIntersections();

        if (intersections.length > 0) {
            intersections.map(i => i.object.Sculpt.emit(eventName, new Event(i.object.Sculpt, DOMEvent, keyCode, this.hand)));
        }
    }

    /**
     * @param {number} keyCode
     */
    onKeyDown(keyCode) {
        this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_KEY_DOWN, null, keyCode);
    }

    /**
     * @param {number} keyCode
     */
    onKeyUp(keyCode) {
        this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_KEY_UP, null, keyCode);
    }

    /**
     * @param {number} keyCode
     */
    onTouchDown(keyCode) {
        this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_TOUCH_START, null, keyCode);
    }

    /**
     * @param {number} keyCode
     */
    onTouchUp(keyCode) {
        this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_TOUCH_END, null, keyCode);
    }
}