import {GamePad} from "./gamePads/GamePad.js";
import {ErrorNoValueProvided, ErrorViveControllerAlreadyExists} from "../error/CustomErrors.js";
import {CONTROLLER_HANDS} from '../constants/constants.js';

let leftHandControllerCreated = false;
let rightHandControllerCreated = false;

export class ViveController extends GamePad {
    constructor(hand, scene = null, camera = null, raycastLayers = 1) {
        if (!hand) {
            throw new ErrorNoValueProvided();
        }

        if (hand === CONTROLLER_HANDS.LEFT && leftHandControllerCreated || hand === CONTROLLER_HANDS.RIGHT && rightHandControllerCreated) {
            throw new ErrorViveControllerAlreadyExists(hand);
        }

        super('openvr', hand, scene, camera, raycastLayers);

        hand === CONTROLLER_HANDS.LEFT ? leftHandControllerCreated = true : rightHandControllerCreated = true;

        let targetGeometry = new THREE.Geometry();
        targetGeometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1)
        );

        let targetLine = new THREE.Line(targetGeometry, new THREE.LineBasicMaterial( {color: 0xff0000 } ));
        this.targetLineDistance = -50;
        targetLine.name = 'targetLine';
        targetLine.geometry.vertices[1].z = this.targetLineDistance;
        this.add(targetLine);
        this.reycastingLine = targetLine;

        if(false){
            this.disable();
        }
    }

    /**
     * Get Intersections
     * Raycast from controller model
     * @returns [Sculpt]
     */
    getIntersections() {
        this.tempMatrix.identity().extractRotation(this.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(this.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
        return this.raycaster.raycast();
    }

    /**
     * Gamepad hover function
     * @param intersect
     */
    gamepadHover(intersect){
        this.reycastingLine.geometry.vertices[1].z = -intersect.distance;
        this.reycastingLine.geometry.verticesNeedUpdate = true;
    }

    /**
     * Gamepad hoverout function
     */
    gamepadHoverOut(){
        this.reycastingLine.geometry.vertices[1].z = this.targetLineDistance;
        this.reycastingLine.geometry.verticesNeedUpdate = true;
    }
}


