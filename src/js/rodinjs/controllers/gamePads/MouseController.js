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
        this.mouseCoords =  new THREE.Vector2();
        this.setRaycasterScene(scene);
        this.setRaycasterCamera(camera);
        this.mouseMove = (event) => {
            this.mouseCoords.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1
            )
        }
        window.addEventListener( 'mousemove', this.mouseMove, false );


    }



    getIntersections() {
        this.raycaster.setFromCamera( this.mouseCoords, this.camera );
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