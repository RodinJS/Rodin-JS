import {THREE} from '../../three/THREE.GLOBAL.js';
import {Controller} from './ViveControllerDef.js';
import {EVENT_NAMES} from '../constants/constants.js';
import {Event} from '../Event.js';
import {Raycaster} from '../raycaster/Raycaster.js'

export class ViveController extends Controller {
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
        let intersections = this.getIntersections(this);

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

    onTriggerDown(event) {
        var intersections = this.getIntersections();

        if (intersections.length > 0) {
            intersections.map(i => i.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_KEY_DOWN, new Event(i.object.Sculpt, event, 1)));
        }
    }

    onTriggerUp(event) {
        var intersections = this.getIntersections();

        if (intersections.length > 0) {
            intersections.map(i => i.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_KEY_UP, new Event(i.object.Sculpt, event, 1)));
        }
    }

    onTumbpadDown(event) {
        var intersections = this.getIntersections();

        if (intersections.length > 0) {
            intersections.map(i => i.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_KEY_DOWN, new Event(i.object.Sculpt, event, 2)));
        }
    }

    onTumbpadUp(event) {
        var intersections = this.getIntersections();

        if (intersections.length > 0) {
            intersections.map(i => i.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_KEY_UP, new Event(i.object.Sculpt, event, 2)));
        }
    }

    onTumbpadTouchDown(event) {
        var intersections = this.getIntersections();

        if (intersections.length > 0) {
            intersections.map(i => i.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_TOUCH_START, new Event(i.object.Sculpt, event, 1)));
        }
    }

    onTumbpadTouchUp(event) {
        var intersections = this.getIntersections();

        if (intersections.length > 0) {
            intersections.map(i => i.object.Sculpt.emit(EVENT_NAMES.CONTROLLER_TOUCH_END, new Event(i.object.Sculpt, event, 1)));
        }
    }

    updateController() {
        this.update();
        this.intersectObjects();
    }
}