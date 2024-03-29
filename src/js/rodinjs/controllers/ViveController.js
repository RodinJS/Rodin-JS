import {GamePad} from "./gamePads/GamePad.js";
import {ErrorNoValueProvided, ErrorViveControllerAlreadyExists} from "../error/CustomErrors.js";
import {CONTROLLER_HANDS} from '../constants/constants.js';
import {ModelLoader} from '../sculpt/ModelLoader.js';
import {THREEObject} from '../sculpt/THREEObject.js';
import {THREE} from '../../vendor/three/THREE.GLOBAL.js';

let leftHandControllerCreated = false;
let rightHandControllerCreated = false;
/**
 * A controller class for describing HTC Vive controllers event handlers.
 * @param {string} hand Required - "left" or "right".
 * @param {THREE.Scene} scene Required - the scene where the controller will be used.
 * @param {THREE.PerspectiveCamera} camera Required - the camera where the controller will be used.
 * @param {number} raycastLayers - the number of objects that can be reycasted by the same ray.
 */
export class ViveController extends GamePad {
    constructor(hand, scene = null, camera = null, raycastLayers = 1) {
        if (!hand || !scene || !camera) {
            throw new ErrorNoValueProvided();
        }

        if (hand === CONTROLLER_HANDS.LEFT && leftHandControllerCreated || hand === CONTROLLER_HANDS.RIGHT && rightHandControllerCreated) {
            throw new ErrorViveControllerAlreadyExists(hand);
        }

        super('openvr', hand, scene, camera, raycastLayers);

        hand === CONTROLLER_HANDS.LEFT ? leftHandControllerCreated = true : rightHandControllerCreated = true;

        /**
         * The length of raycasting ray of controller, the value must be < 0 to maintain correct direction.
         * @type {number}
         */
        this.targetLineDistance = -50;

        /**
         * The raycasting ray Line object of controller (red by default).
         * @type {THREE.Line}
         */
        this.raycastingLine = null;
    }

    /**
     * Get raycasted objects ({distance, point, face, faceIndex, indices, object})of the controller's pointer ray.
     * @returns [Object]
     */
    getIntersections() {
        this.tempMatrix.identity().extractRotation(this.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(this.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
        return this.raycaster.raycast();
    }

    /**
     * Custom function to be triggered when controller's pointer ray hovers any raycastable element.
     * By default, this function shortens the pointer ray to the length of controller to element distance.
     * @param {Object} intersect - intersected object ({distance, point, face, faceIndex, indices, object}) at the time of event.
     */
    gamepadHover(intersect) {
        if(!this.raycastingLine) return;
        if(!this.raycastingLine.ready) return;
        this.raycastingLine.object3D.geometry.vertices[1].z = -intersect[0].distance;
        this.raycastingLine.object3D.geometry.verticesNeedUpdate = true;
    }

    /**
     * Custom function to be triggered when controller's pointer ray hovers out of any raycastable element.
     * By default, this function resets the pointer ray length.
     */
    gamepadHoverOut() {
        if(!this.raycastingLine) return;
        if(!this.raycastingLine.ready) return;
        this.raycastingLine.object3D.geometry.vertices[1].z = this.targetLineDistance;
        this.raycastingLine.object3D.geometry.verticesNeedUpdate = true;
    }

    /**
     * Set Controller model
     * @param model
     */
    initControllerModel(model) {
        if (!model) {
            model = ModelLoader.load('https://cdn.rodin.io/resources/models/ViveController_v1/model.obj');

            model.on('ready', () => {
                const loader =  new THREE.TextureLoader();
                model.object3D.children[0].material.map = loader.load('https://cdn.rodin.io/resources/models/ViveController_v1/texture.png');
                model.object3D.children[0].material.specularMap = loader.load('https://cdn.rodin.io/resources/models/ViveController_v1/spcular.png');
            })
        }

        const addModel = () => {
            this.controllerModel && this.remove(this.controllerModel.object3D);
            this.controllerModel = model;
        };

        if (model.ready) {
            addModel();
        } else {
            model.on('ready', () => {
                addModel();
            })
        }
    }

    initRaycastingLine() {
        let targetGeometry = new THREE.Geometry();
        targetGeometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1)
        );

        let targetLine = new THREE.Line(targetGeometry, new THREE.LineBasicMaterial({color: 0xff0000}));
        targetLine.name = 'targetLine';
        targetLine.geometry.vertices[1].z = this.targetLineDistance;
        this.raycastingLine = new THREEObject(targetLine);
    }
}


