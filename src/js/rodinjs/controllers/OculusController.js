import {Raycaster} from '../raycaster/Raycaster.js';
import {EVENT_NAMES} from '../constants/constants.js';
import {KEY_CODES} from '../constants/KeyCodes.js';
import {Event} from '../Event.js';

export class OculusController {
    constructor() {
        this.buttonsPressed = [false, false, false, false, false, false];
        this.raycaster = new Raycaster();
        this.camera = null;
        this.intersected = [];

        this.buttons = [
            KEY_CODES.KEY1,
            KEY_CODES.KEY2,
            KEY_CODES.KEY3,
            KEY_CODES.KEY4,
            KEY_CODES.KEY5,
            KEY_CODES.KEY6
        ];
    }

    update() {
        let controller = navigator.getGamepads()[0];
        if (!controller) return;

        for (let i = 0; i < controller.buttons.length; i++) {
            if (this.buttonsPressed[i] !== controller.buttons[i].pressed) {
                controller.buttons[i].pressed ? this.onKeyDown(this.buttons[i]) : this.onKeyUp(this.buttons[i]);
                this.buttonsPressed[i] = controller.buttons[i].pressed;
            }
        }

        this.getIntersections();
    }

    setRaycasterScene(scene) {
        this.raycaster.setScene(scene);
    }

    setRaycasterCamera(camera) {
        this.camera = camera;
    }

    getIntersections(){
        this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());
        return this.raycaster.raycast();
    }

    intersectObjects() {
        if (this.userData.selected !== undefined) return;
        let line = this.getObjectByName('line');
        let intersections = this.getIntersections();

        if (intersections.length > 0) {
            this.intersected.map(i => {
                let found = false;
                for (let i in intersections) {
                    if (intersections[i].object.Sculpt === i)
                        found = true;
                }
                if (!found) {
                    i.emit(EVENT_NAMES.CONTROLLER_HOVER_OUT);
                }
            });

            this.intersected = [];
            intersections.map(intersect => {
                intersect.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_HOVER, new Event(intersect.object.Sculpt));
                this.intersected.push(intersect.object.Sculpt);
            });
        } else {
            line.scale.z = 5;
        }
    }

    raycastAndEmitEvent(eventName, DOMEvent, keyCode) {
        var intersections = this.getIntersections();

        if (intersections.length > 0) {
            intersections.map(i => i.object.Sculpt.emit(eventName, new Event(i.object.Sculpt, DOMEvent, keyCode)));
        }
    }

    onKeyDown(keyCode) {
        this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_KEY_DOWN, null, keyCode);
    }

    onKeyUp(keyCode) {
        this.raycastAndEmitEvent(EVENT_NAMES.CONTROLLER_KEY_UP, null, keyCode);
    }
}