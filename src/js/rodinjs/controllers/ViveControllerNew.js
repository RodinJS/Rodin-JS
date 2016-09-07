import {THREE} from '../../three/THREE.GLOBAL.js';
import {EVENT_NAMES, KEY_CODES} from '../constants/constants.js';
import {Event} from '../Event.js';
import {Raycaster} from '../raycaster/Raycaster.js'


export class ViveController extends THREE.Object3D {
    constructor() {
        if(!ViveController.getController()) {
            console.warn('Controller not found');
        }

        super();

        this.buttonsPressed = [false, false, false, false];
        this.buttonsTouched = [false, false, false, false];
        this.raycaster = new Raycaster();
        //this.camera = null;
        this.intersected = [];
        this.tempMatrix = new THREE.Matrix4();

        this.matrixAutoUpdate = false;
        this.standingMatrix = new THREE.Matrix4();

        this.buttons = [
            KEY_CODES.KEY1,
            KEY_CODES.KEY2,
            KEY_CODES.KEY3,
            KEY_CODES.KEY4
        ];
    }

    static getController() {
        let controllers = navigator.getGamepads();
        for(let i = 0; i < controllers.length; i ++) {
            let controller = controllers[i];
            if(controller && controller.id && controller.id.match(/OpenVR/gi)) {
                return controller;
            }
        }

        return null;
    }

    update() {
        let controller = ViveController.getController();
        if (!controller) {
            console.warn('Controller not found');
            return;
        }
        
        for (let i = 0; i < controller.buttons.length; i++) {
            if (this.buttonsPressed[i] !== controller.buttons[i].pressed) {
                controller.buttons[i].pressed ? this.onKeyDown(this.buttons[i]) : this.onKeyUp(this.buttons[i]);
                this.buttonsPressed[i] = controller.buttons[i].pressed;
                /*console.log("btn pressed - " + this.buttonsPressed[i] );
                console.log("btn i - " + controller.buttons[i] );*/
            }

            if (this.buttonsTouched !== controller.buttons[i].touched) {
                controller.buttons[i].touched ? this.onTouchDown(this.buttons[i]) : this.onTouchUp(this.buttons[i]);
                this.buttonsTouched = controller.buttons[i].touched;
                //console.log("btn touched - " + this.buttonsTouched );
            }
        }

        this.intersectObjects();
        this.updateObject(controller);
    }

    updateObject(controller) {
        if(controller.pose !== null) {
            var pose = controller.pose;

            if ( pose.position !== null ) this.position.fromArray( pose.position );
            if ( pose.orientation !== null ) this.quaternion.fromArray( pose.orientation );
            this.matrix.compose( this.position, this.quaternion, this.scale );
            this.matrix.multiplyMatrices( this.standingMatrix, this.matrix );
            this.matrixWorldNeedsUpdate = true;
            this.visible = true;
        }
    }

    setRaycasterScene(scene) {
        this.raycaster.setScene(scene);
    }

    getIntersections(){
        this.tempMatrix.identity().extractRotation(this.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(this.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
        return this.raycaster.raycast();
    }

    intersectObjects() {
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

    onTouchDown(keyCode) {
        this.raycastAndEmitEvent( EVENT_NAMES.CONTROLLER_TOUCH_START, null, keyCode );
    }

    onTouchUp(keyCode) {
        this.raycastAndEmitEvent( EVENT_NAMES.CONTROLLER_TOUCH_END, null, keyCode );
    }
}