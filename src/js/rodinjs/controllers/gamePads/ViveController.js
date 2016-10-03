import {GamePad} from "./GamePad.js";
import {ErrorNoValueProvided, ErrorViveControllerAlreadyExists} from "../../error/CustomErrors.js";
import {CONTROLLER_HANDS} from '../../constants/constants.js';

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

        var targetGeometry = new THREE.Geometry();
        targetGeometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1)
        );

        var targetLine = new THREE.Line(targetGeometry, new THREE.LineBasicMaterial( {color: 0xff0000 } ));
        targetLine.name = 'targetLine';
        targetLine.geometry.vertices[1].z = -50;
        this.add(targetLine);
        this.reycastingLine = targetLine;
    }

    getIntersections() {
        this.tempMatrix.identity().extractRotation(this.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(this.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
        return this.raycaster.raycast();
    }

    gampadHover(intersect){
        this.reycastingLine.geometry.vertices[1].z = -intersect.distance;
        this.reycastingLine.geometry.verticesNeedUpdate = true;
    }
    gampadHoverOut(){
        this.reycastingLine.geometry.vertices[1].z = -50;
        this.reycastingLine.geometry.verticesNeedUpdate = true;
    }

}


