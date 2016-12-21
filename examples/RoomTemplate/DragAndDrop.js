import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {ViveController} from '../../_build/js/rodinjs/controllers/ViveController.js';

import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';

let scene = SceneManager.get();
let camera = scene.camera;
let originalScene = scene.scene;
const controllerKeyDown = (evt) => {
    if(evt.controller instanceof MouseController) {
        let controller = evt.controller;
        let target = evt.target;
        controller.pickedItems.push(target.object3D);

        let initParent = target.object3D.parent;
        changeParent(target.object3D, originalScene);

        target.object3D.raycastCameraPlane = new THREE.Plane();
        target.object3D.offset = new THREE.Vector3();
        target.object3D.intersection = new THREE.Vector3();

        target.object3D.raycastCameraPlane.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(target.object3D.raycastCameraPlane.normal),
            target.object3D.position
        );

        if (controller.raycaster.ray.intersectPlane(target.object3D.raycastCameraPlane, target.object3D.intersection)) {
            target.object3D.offset.copy(target.object3D.intersection).sub(target.object3D.position);
            if (evt.keyCode === 3) {
                let initParent = target.object3D.parent;
                changeParent(target.object3D, camera);
                target.object3D.initRotation = target.object3D.rotation.clone();
                target.object3D.initMousePos = {x: controller.axes[0], y: controller.axes[1]};
                changeParent(target.object3D, initParent);
            }
        }
        changeParent(target.object3D, initParent);
    }
    if(evt.controller instanceof ViveController) {

    }
};

const controllerValueChange = (evt) =>{
    let gamePad = MouseController.getGamepad();
    let target = evt.target;
    if (evt.keyCode === 2) {
        let initParent = target.object3D.parent;
        changeParent(target.object3D, camera);
        if (gamePad.buttons[evt.keyCode - 1].value > 0){
            target.object3D.position.z += (camera.position.z - target.object3D.position.z) * 0.05;
        } else {
            target.object3D.position.z -= (camera.position.z - target.object3D.position.z) * 0.05;
        }
        gamePad.buttons[evt.keyCode - 1].value = 0;
        changeParent(target.object3D, initParent);
    }
};

const controllerUpdate = function() {
    this.raycaster.setFromCamera({x: this.axes[0], y: this.axes[1]}, camera);

    if (this.pickedItems && this.pickedItems.length > 0) {
        this.pickedItems.map(item => {
            if (this.raycaster.ray.intersectPlane(item.raycastCameraPlane, item.intersection)) {
                if (this.keyCode === 1) {
                    let initParent = item.parent;
                    changeParent(item, originalScene);
                    item.position.copy(item.intersection.sub(item.offset));
                    changeParent(item, initParent);
                } else if (this.keyCode === 3) {
                    let shift = {x: this.axes[0] - item.initMousePos.x, y: this.axes[1] - item.initMousePos.y};
                    item.initMousePos = {x: this.axes[0], y: this.axes[1]};
                    let initParent = item.parent;
                    changeParent(item, camera);
                    let deltaRotationQuaternion = new THREE.Quaternion()
                        .setFromEuler(
                            new THREE.Euler(-shift.y * Math.PI, shift.x * Math.PI, 0, 'XYZ')
                        );

                    item.quaternion.multiplyQuaternions(deltaRotationQuaternion, item.quaternion);

                    changeParent(item, initParent);
                }
            }
        });
    }
};

export const DragAndDrop = {
    controllerKeyDown,
    controllerValueChange,
    controllerUpdate
};
