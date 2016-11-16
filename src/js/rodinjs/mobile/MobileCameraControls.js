'use strict';
import * as THREE from '../../vendor/three/Three.custom.js';
import {OrbitControls} from '../OrbitControls.js';
import {MobileDeviceOrientationControls} from './MobileDeviceOrientationControls.js';


export class MobileCameraControls {
    /**
     * MobileCameraControls Class
     * Uses THREE.OrbitControlsCustom (modified for better UX) and RODIN.MobileDeviceOrientationControls libraries
     * Requires three cameras
     * @param {THREE.Scene} scene - The scene value.
     * @param {THREE.PerspectiveCamera} camera - The camera value.
     * @param {THREE.Vector3} position - The position value.
     * @param {THREE.Vector3} offset - The offset value.
     * @param {HTMLElement} domElement - The domElement value.
     * @param {Boolean} withOrientation - The withOrientation value.
     */
    constructor(scene, camera, position, offset, domElement, withOrientation) {

        let cameraStand = new THREE.Object3D();
        this.object = cameraStand;

        this.horizontalPivot = new THREE.PerspectiveCamera(camera.fov, camera.aspect, camera.near, camera.far);
        this.verticalPivot = new THREE.PerspectiveCamera(camera.fov, camera.aspect, camera.near, camera.far);
        let backSet = new THREE.Vector3(position.x + offset.x, position.y + offset.y, position.z + offset.z);
        let frontSet = new THREE.Vector3(position.x - 2 * offset.x, position.y - 2 * offset.y, position.z - 2 * offset.z);

        scene.add(cameraStand);
        cameraStand.add(this.horizontalPivot);
        this.horizontalPivot.position.copy(backSet);

        this.horizontalPivot.add(this.verticalPivot);
        this.verticalPivot.position.copy(frontSet);

        this.verticalPivot.add(camera);
        camera.position.copy(backSet);

        this.enabled = true;
        this.withOrientation = withOrientation;

        this.orientationControl = null;

        this.dragControlVertical = new OrbitControls(camera, domElement);
        this.dragControlVertical.target = position;
        this.dragControlVertical.minAzimuthAngle = 0;
        this.dragControlVertical.maxAzimuthAngle = 0;
        this.dragControlVertical.enableDamping = true;
        this.dragControlVertical.dampingFactor = 0.10;
        this.dragControlVertical.enableZoom = false;

        this.dragControlHorizontal = new OrbitControls(this.horizontalPivot, domElement);
        this.dragControlHorizontal.target = position;
        this.dragControlHorizontal.minPolarAngle = Math.PI / 2;
        this.dragControlHorizontal.maxPolarAngle = Math.PI / 2;
        this.dragControlHorizontal.enableDamping = true;
        this.dragControlHorizontal.dampingFactor = 0.10;
        this.dragControlHorizontal.enableZoom = false;

        this.setOrientationControls = (e) => {
            if (!e.alpha || !this.withOrientation) {
                return;
            }
            this.object.rotation.y = Math.PI;
            this.orientationControl = new MobileDeviceOrientationControls(this.verticalPivot);
            this.orientationControl.connect();
            this.orientationControl.update();
            window.removeEventListener('deviceorientation', this.setOrientationControls, true);
        };

        window.addEventListener('deviceorientation', this.setOrientationControls, true);
        camera.updateMatrixWorld();

    }


    /**
     * Enable Draging by enabling dragControlVertical and dragControlHorizontal.
     */
    enableDrag() {
        this.dragControlVertical.enabled = true;
        this.dragControlHorizontal.enabled = true;
    }

    /**
     * Disable Draging by disabling dragControlVertical and dragControlHorizontal.
     */
    disableDrag() {
        this.dragControlVertical.enabled = false;
        this.dragControlHorizontal.enabled = false;
    }

    /**
     * Enable Orientation.
     */
    enableOrientation() {
        if (this.orientationControl) {
            this.orientationControl.connect();
        }
        else {
            this.withOrientation = true;
            window.addEventListener('deviceorientation', this.setOrientationControls, true);
        }
    };

    disableOrientation() {
        this.withOrientation = false
        if (this.orientationControl) {
            this.orientationControl.disconnect();
            this.orientationControl.object.rotation.x = 0;
            this.orientationControl.object.rotation.z = 0;
        }
    };

    enable() {
        this.enableDrag();
        if (this.withOrientation) {
            this.enableOrientation();
        }
        this.enabled = true;
    };

    disable() {
        this.disableDrag();
        if (this.withOrientation) {
            this.disableOrientation();
        }
        this.enabled = false;
    };

    /**
     * This is a funny function. Returns nothing.
     * @param {Number} angle - rotation angle
     */
    rotateLeft(angle) {
        this.dragControlHorizontal.rotateLeft(angle);
    };

    /**
     * This is a funny function. Returns nothing.
     * @param {Number} angle - rotation angle
     */
    rotateUp(angle) {
        this.dragControlVertical.rotateUp(angle);
    };

    resetVertical() {
        if (this.dragControlVertical) {
            this.dragControlVertical.reset();
        }
    };

    resetHorizontal() {
        if (this.dragControlHorizontal) {
            this.dragControlHorizontal.reset();
        }
    };

    reset() {
        this.resetHorizontal();
        this.resetVertical();
        if (this.orientationControl) {
            if (this.withOrientation) {
                this.orientationControl.disconnect();
                this.orientationControl = new MobileDeviceOrientationControls(this.verticalPivot);
                this.orientationControl.connect();
                this.orientationControl.update();
            }
        }
    };

    update() {
        // console.log("positionX: ", this.verticalPivot.position.x, " posY ", this.verticalPivot.position.y, " rotX ", this.verticalPivot.rotation.x, " rotY ", this.verticalPivot.rotation.y);
        if (!this.enabled) return;

        if (this.dragControlHorizontal) {
            // console.log("dragControlHorizontal ", this.dragControlHorizontal);
            this.dragControlHorizontal.update();
        }

        if (this.dragControlVertical) {
            // console.log("dragControlVertical ", this.dragControlVertical);
            this.dragControlVertical.update();
        }

        if (this.orientationControl) {
            // console.log("orientationControl ", this.orientationControl);
            this.orientationControl.update();
        }
    };

    previewControls() {
        if (this.dragControlHorizontal) {
            this.dragControlHorizontal.previewControls();
        }
    };

    getRotation() {
        return new THREE.Vector3().copy(camera.rotation).add(this.horizontalPivot.rotation).add(this.verticalPivot.rotation);
    };
}


