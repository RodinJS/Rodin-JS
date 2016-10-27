import {GamePad} from "./GamePad.js";
import {ErrorMouseControllerAlreadyExists} from '../../error/CustomErrors.js';

let controllerCreated = false;

export class MouseController extends GamePad {
    constructor(scene = null, camera = null) {
        if(controllerCreated) {
            throw new ErrorMouseControllerAlreadyExists();
        }
        controllerCreated = true;
        super("mouse", null, scene, camera, 2);

        this.setRaycasterScene(scene);
        this.setRaycasterCamera(camera);
        this.mouseMove = (event) => {
            this.customController.mouseCoords.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1
            )
        };
        this.mouseDown = (event) => {

            switch(event.button) {
                case 0:
                    this.customController.buttons[0].pressed = true;
                    break;
                case 1:
                    this.customController.buttons[1].pressed = true;
                    break;
                case 2:
                    this.customController.buttons[2].pressed = true;
                    break;
                default:
                    break;
            }
        };
        this.mouseUp = (event) => {
            switch(event.button) {
                case 0:
                    this.customController.buttons[0].pressed = false;
                    break;
                case 1:
                    this.customController.buttons[1].pressed = false;
                    break;
                case 2:
                    this.customController.buttons[2].pressed = false;
                    break;
                default:
                    break;
            }
        };
        window.addEventListener( 'mousemove', this.mouseMove, false );
        window.addEventListener( 'mousedown', this.mouseDown, false );
        window.addEventListener( 'mouseup', this.mouseUp, false );
        this.customController = {};
        this.customController.mouseCoords =  new THREE.Vector2();
        this.customController.buttons = [];
        this.customController.buttons[0] = {
            pressed: false,
            touched: false
        };
        this.customController.buttons[1] = {
            pressed: false,
            touched: false
        };
        this.customController.buttons[2] = {
            pressed: false,
            touched: false
        };
    }



    getIntersections() {
        this.raycaster.setFromCamera( this.customController.mouseCoords, this.camera );
        return this.raycaster.raycast();
    }
    gamepadHover(intersect){
        //this.reycastingLine.geometry.vertices[1].z = -intersect.distance;
        //this.reycastingLine.geometry.verticesNeedUpdate = true;
    }
    gamepadHoverOut(){
        //this.reycastingLine.geometry.vertices[1].z = -50;
        //this.reycastingLine.geometry.verticesNeedUpdate = true;
    }

}