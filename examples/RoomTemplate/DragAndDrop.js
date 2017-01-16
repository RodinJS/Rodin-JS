import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {ViveController} from '../../_build/js/rodinjs/controllers/ViveController.js';
import {OculusController} from '../../_build/js/rodinjs/controllers/OculusController.js';

import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';
import * as PhysicsUtils from '../../_build/js/rodinjs/utils/physicsUtils.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';

let scene = SceneManager.get();
let camera = scene.camera;
let originalScene = scene.scene;
const objectKeyDown = (evt) => {
    if (evt.controller instanceof MouseController) {
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
    if (evt.controller instanceof ViveController) {
    }
    if (evt.controller instanceof OculusController) {
        let controller = evt.controller;
        let target = evt.target;

        controller.pickedItems.push(target.object3D);

        let initParent = target.object3D.parent;
        changeParent(target.object3D, camera);
        let holder  = new THREE.Object3D();
        // let holder  = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.1));
        holder.position.copy(target.object3D.position);
        camera.add(holder);
        camera.objectHolder = holder;
        changeParent(target.object3D, initParent);
    }
};


const objectKeyUp = (evt) => {
    if (evt.controller instanceof MouseController) {

    }
    if (evt.controller instanceof ViveController) {
        if (evt.keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
        this.engaged = false;
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                let targetParent = item.parent;
                changeParent(item, item.initialParent);
                this.raycastingLine.object3D.remove(targetParent);
            });
            if (this.raycastingLine.object3D.children.length > 0) {
                this.raycastingLine.object3D.children.map(item => {
                    this.raycastingLine.object3D.remove(item);
                });
            }
            this.raycastingLine.object3D.children = [];
            this.pickedItems = [];
        }
    }
    if (evt.controller instanceof OculusController) {
        camera.remove(camera.objectHolder);
        camera.objectHolder = null;
    }
};

const objectValueChange = (evt) => {
    if (evt.controller instanceof MouseController) {
        let gamePad = MouseController.getGamepad();
        let target = evt.target;
        if (evt.keyCode === 2) {
            let initParent = target.object3D.parent;
            changeParent(target.object3D, camera);
            if (gamePad.buttons[evt.keyCode - 1].value > 0) {
                if (target.object3D.rigidBody) {
                    target.object3D.rigidBody.body.position.z += (camera.position.z - target.object3D.rigidBody.body.position.z) * 0.05;

                } else {
                    target.object3D.position.z += (camera.position.z - target.object3D.position.z) * 0.05;
                }
            } else {
                if (target.object3D.rigidBody) {
                    target.object3D.rigidBody.body.position.z -= (camera.position.z - target.object3D.rigidBody.body.position.z) * 0.05;

                } else {
                    target.object3D.position.z -= (camera.position.z - target.object3D.position.z) * 0.05;
                }
            }
            gamePad.buttons[evt.keyCode - 1].value = 0;
            changeParent(target.object3D, initParent);
        }
        /*let item;
         if (target.object3D.rigidBody) {
         item = target.object3D.rigidBody.body;
         } else {
         item = target.object3D;
         }

         let initParent = item.parent;
         changeParent(item, camera);
         if (gamePad.buttons[evt.keyCode - 1].value > 0) {

         item.position.z += (camera.position.z - item.position.z) * 0.05;

         } else {
         item.position.z -= (camera.position.z - item.position.z) * 0.05;

         }
         gamePad.buttons[evt.keyCode - 1].value = 0;
         changeParent(item, initParent);
         */
    }
};

const objectUpdate = function () {
    if (this instanceof MouseController) {
        this.raycaster.setFromCamera({x: this.axes[0], y: this.axes[1]}, camera);

        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                if (this.raycaster.ray.intersectPlane(item.raycastCameraPlane, item.intersection)) {
                    if (this.keyCode === 1) {
                        let initParent = item.parent;
                        changeParent(item, originalScene);
                        if (item.rigidBody) {
                            let pointerShift = item.intersection.sub(item.offset).multiplyScalar(100);
                            let vec = new OIMO.Vec3(pointerShift.x, pointerShift.y, pointerShift.z);
                            item.rigidBody.body.sleeping = false;
                            item.rigidBody.body.setPosition(vec);
                        } else {
                            item.position.copy(item.intersection.sub(item.offset));
                        }

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

                        if (item.rigidBody) {
                            item.rigidBody.body.sleeping = false;
                            let pointerShift = new THREE.Quaternion();
                            let bodyQuat = PhysicsUtils.oimoToThree(item.rigidBody.body.getQuaternion());
                            pointerShift.multiplyQuaternions(deltaRotationQuaternion, bodyQuat);

                            let quat = new OIMO.Quaternion(
                                pointerShift.x,
                                pointerShift.y,
                                pointerShift.z,
                                pointerShift.w);

                            item.rigidBody.body.setQuaternion(quat);

                        } else {
                            item.quaternion.multiplyQuaternions(deltaRotationQuaternion, item.quaternion);
                        }

                        changeParent(item, initParent);
                    }
                }
            });
        }
    }
    if (this instanceof ViveController) {
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                if (item instanceof OIMO.RigidBody) {

                    item.sleeping = false;
                    //console.log(this.raycastingLine.object3D.children[0]);
                    let targetPos = this.raycastingLine.object3D.children[0].getWorldPosition();
                    // console.log(targetPos);
                    let vec = new OIMO.Vec3(targetPos.x*100, targetPos.y*100, targetPos.z*100);
                    item.setPosition(vec);
                }
            });
        }
    }
    if (this instanceof OculusController) {
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                if (item.rigidBody.body && item.rigidBody.body instanceof OIMO.RigidBody) {
                    item.rigidBody.body.sleeping = false;
                    //console.log(this.raycastingLine.object3D.children[0]);
                    let targetPos = camera.objectHolder.getWorldPosition();
                    // console.log(targetPos);
                    let vec = new OIMO.Vec3(targetPos.x*100, targetPos.y*100, targetPos.z*100);
                    item.rigidBody.body.setPosition(vec);
                }
            });
        }
    }
};

function ViveControllerKeyDown(keyCode) {
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }

    if (this.intersected && this.intersected.length > 0) {
        this.intersected.map(intersect => {
            if (intersect.object.parent != intersect.object.initialParent) {
                return;
            }
            let item;
            if (intersect.object.rigidBody) {
                item = intersect.object.rigidBody.body;

                let initialParent = intersect.object.parent;
                changeParent(intersect.object, this.raycastingLine.object3D);
                let target = new THREE.Object3D();
                // let target = new THREE.Mesh(new THREE.BoxGeometry(0.02,0.02,0.02));
                this.raycastingLine.object3D.add(target);
                target.name = "d";
                let pos = intersect.object.position;
                target.position.set(
                    pos.x,
                    pos.y,
                    pos.z);

                changeParent(intersect.object, initialParent);

                this.pickedItems.push(item);
                /*if (intersect.initialRotX) {
                 intersect.initialRotX = 0;
                 intersect.initialRotY = 0;
                 }*/
            } else {
                item = intersect.object;

                changeParent(item, this.raycastingLine.object3D);
                let targetParent = new THREE.Object3D();
                this.raycastingLine.object3D.add(targetParent);
                targetParent.position.copy(item.position);
                changeParent(item, targetParent);

                this.pickedItems.push(item);
                if (intersect.initialRotX) {
                    intersect.initialRotX = 0;
                    intersect.initialRotY = 0;
                }
            }
        });
    }
}

function ViveControllerKeyUp(keyCode) {
    objectKeyDown();
}

function OculusControllerKeyDown(keyCode) {
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }
    objectKeyDown();
}

function OculusControllerKeyUp(keyCode) {
    this.engaged = false;
    this.pickedItems = [];
    objectKeyDown();
}

export const DragAndDrop = {
    objectKeyDown,
    objectValueChange,
    objectUpdate,
    objectKeyUp,
    ViveControllerKeyUp,
    ViveControllerKeyDown,
    OculusControllerKeyDown,
    OculusControllerKeyUp
};
