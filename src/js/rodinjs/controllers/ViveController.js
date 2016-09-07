import {THREE} from '../../three/THREE.GLOBAL.js';
import {Controller} from './ViveControllerDef.js';
import {EVENT_NAMES, KEY_CODES} from '../constants/constants.js';
import {Event} from '../Event.js';
import {Raycaster} from '../raycaster/Raycaster.js'

export class ViveController extends Controller {

    /**
     * Controllers event
     * @param {number} id controller id, can be 0 or 1, for left and right hands
     */

    constructor(id) {
        super(id);

        this.addEventListener('triggerdown', this.onTriggerDown);
        this.addEventListener('triggerup', this.onTriggerUp);
        this.addEventListener('thumbpaddown', this.onTumbpadDown);
        this.addEventListener('thumbpadup', this.onTumbpadUp);
        this.addEventListener('thumbpadtouchdown', this.onTumbpadTouchDown);
        this.addEventListener('thumbpadtouchup', this.onTumbpadTouchUp);

        this.tempMatrix = new THREE.Matrix4();
        this.raycaster = new Raycaster();
        this.intersected = [];
    }

    setRaycasterScene(scene) {
        this.raycaster.setScene(scene);
    }

    getIntersections() {
        this.tempMatrix.identity().extractRotation(this.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(this.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
        return this.raycaster.raycast();
    }

    intersectObjects() {
        if (this.userData.selected !== undefined) return;
        let line = this.getObjectByName('line');
        let intersections = this.getIntersections();

        this.intersected.map(i => {
            let found = false;
            for (let int = 0; int < intersections.length; int++) {
                if (intersections[int].object.Sculpt === i)
                    found = true;
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
        } else {
            line.scale.z = 5;
        }
    }

    /**
     * Controllers event
     *
     * @param {string} eventName name of event from controller
     * @param {number} keyCode controller buttons key code
     * @param {Event} DOMEvent
     *
     */

    raycastAndEmitEvent(eventName, keyCode, DOMEvent) {
        var intersections = this.getIntersections();

        if (intersections.length > 0) {
            intersections.map(i => i.object.Sculpt.emit(eventName, new Event(i.object.Sculpt, DOMEvent, keyCode)));
        }
    }

    onTriggerDown(event) {
        this.raycastAndEmitEvent( EVENT_NAMES.CONTROLLER_KEY_DOWN, KEY_CODES.KEY1, event );
    }

    onTriggerUp(event) {
        this.raycastAndEmitEvent( EVENT_NAMES.CONTROLLER_KEY_UP, KEY_CODES.KEY1, event );
    }

    onTumbpadDown(event) {
        this.raycastAndEmitEvent( EVENT_NAMES.CONTROLLER_KEY_DOWN, KEY_CODES.KEY2, event );
    }

    onTumbpadUp(event) {
        this.raycastAndEmitEvent( EVENT_NAMES.CONTROLLER_KEY_UP, KEY_CODES.KEY2, event );
    }

    onTumbpadTouchDown(event) {
        this.raycastAndEmitEvent( EVENT_NAMES.CONTROLLER_TOUCH_START, KEY_CODES.KEY1, event );
    }

    onTumbpadTouchUp(event) {
        this.raycastAndEmitEvent( EVENT_NAMES.CONTROLLER_TOUCH_END, KEY_CODES.KEY1, event );
    }

    updateController() {
        this.update();
        this.intersectObjects();
    }
}