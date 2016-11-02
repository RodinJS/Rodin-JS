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

    }



    getIntersections(controller) {
        this.raycaster.setFromCamera( new THREE.Vector2(controller.axes[0],controller.axes[1]), this.camera );
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
    getGamepad(){
        return navigator.mouseGamePad;
    }

}