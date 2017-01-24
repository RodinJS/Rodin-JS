import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';

import {MouseController}     from '../../_build/js/rodinjs/controllers/MouseController.js';
import {ViveController}      from '../../_build/js/rodinjs/controllers/ViveController.js';
import {OculusController}    from '../../_build/js/rodinjs/controllers/OculusController.js';
import {CardboardController} from '../../_build/js/rodinjs/controllers/CardboardController.js';

import changeParent  from '../../_build/js/rodinjs/utils/ChangeParent.js';
import * as PhysicsUtils from '../../_build/js/rodinjs/utils/physicsUtils.js';

let scene = SceneManager.get();
let camera = scene.camera;
let originalScene = scene.scene;

const objectKeyDown = (evt) => {
    let controller = evt.controller;
    let target = evt.target;
    let item = target.object3D;

    if (!item.initialParent) {
        item.initialParent = item.parent;
    }
    let initialParent = item.initialParent;

    if (controller instanceof MouseController) {
        item.raycastCameraPlane = new THREE.Plane();
        item.intersection = new THREE.Vector3();
        item.offset = new THREE.Vector3();

        item.raycastCameraPlane.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(item.raycastCameraPlane.normal),
            item.getWorldPosition()
        );
        if (controller.raycaster.ray.intersectPlane(item.raycastCameraPlane, item.intersection)) {
            item.offset.copy(item.intersection).sub(item.getWorldPosition());
            if (evt.keyCode === 3) {
                item.initRotation = item.rotation.clone();
                item.initMousePos = {x: controller.axes[0], y: controller.axes[1]};
            }
        }
    }
    if (controller instanceof ViveController) {
        if (controller.intersected && controller.intersected.length > 0) {
            controller.intersected.map(intersect => {
                if (item !== intersect.object) {
                    return;
                }
                let holder = new RODIN.THREEObject(new THREE.Object3D());
                holder.on('ready', ()=>{
                    holder.object3D.name = 'holder';
                    controller.raycastingLine.object3D.add(holder.object3D);
                    holder.object3D.Sculpt.setGlobalPosition(item.getWorldPosition());
                    holder.object3D.Sculpt.setGlobalQuaternion(item.getWorldQuaternion());
                });
            });
        }
    }
    if (controller instanceof OculusController) {
        if (controller.intersected && controller.intersected.length > 0) {
            controller.intersected.map(intersect => {
                if (item !== intersect.object) {
                    return;
                }
                //changeParent(item, camera);

                let holder = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,0.2)));
                holder.on('ready', ()=>{
                    holder.object3D.name = 'holder';
                    camera.add(holder.object3D);
                    item.objectHolder = holder.object3D;
                    holder.object3D.Sculpt.setGlobalPosition(item.getWorldPosition());
                    holder.object3D.Sculpt.setGlobalQuaternion(item.getWorldQuaternion());
                });


                // let holder = new THREE.Object3D();
                // holder.position.copy(item.position);
                // holder.name = 'holder';
                //
                // camera.add(holder);
                // item.objectHolder = holder;

                /*if (item.rigidBody) {
                    changeParent(item, initialParent);
                } else {
                    changeParent(item, holder);
                }*/
            })
        }
    }
    if (controller instanceof CardboardController) {
        if (controller.intersected && controller.intersected.length > 0) {
            controller.intersected.map(intersect => {
                if (item !== intersect.object) {
                    return;
                }
                /*changeParent(item, camera);

                let holder = new THREE.Object3D();
                holder.position.copy(item.position);
                holder.name = 'holder';

                camera.add(holder);
                item.objectHolder = holder;

                if (item.rigidBody) {
                    changeParent(item, initialParent);
                } else {
                    changeParent(item, holder);
                }*/

                //let holder = new RODIN.THREEObject(new THREE.Object3D());
                let holder = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,0.2)));
                holder.on('ready', ()=>{
                    holder.object3D.name = 'holder';
                    camera.add(holder.object3D);
                    item.objectHolder = holder.object3D;
                    holder.object3D.Sculpt.setGlobalPosition(item.getWorldPosition());
                    holder.object3D.Sculpt.setGlobalQuaternion(item.getWorldQuaternion());
                });
            })
        }
    }

    controller.pickedItems.push(item);
};

const objectKeyUp = (evt) => {
    let controller = evt.controller;
    let target = evt.target;
    let item = target.object3D;
    if (!item.initialParent) {
        item.initialParent = item.parent;
    }

    if (controller instanceof MouseController) {
    }
    if (controller instanceof ViveController) {
        if (controller.pickedItems && controller.pickedItems.length > 0) {
            if (controller.raycastingLine.object3D.children.length > 0) {
                controller.raycastingLine.object3D.children.map(child => {
                    if (child.name === "holder") {
                        controller.raycastingLine.object3D.remove(child);
                    }
                });
            }
            controller.raycastingLine.object3D.children = [];
        }
    }
    if (controller instanceof OculusController) {
        if (controller.pickedItems && controller.pickedItems.length > 0) {
            controller.pickedItems.map(item => {
                /*changeParent(item, initialParent);
                item.objectHolder = null;

                if (camera.children.length > 0) {
                    camera.children.map(child => {
                        if (child.name === "holder") {
                            camera.remove(child);
                        }
                    });
                }*/

                // todo check objectHolder is null time to time
                if (camera.children.length > 0) {
                    camera.children.map(child => {
                        if (child.name === "holder") {
                            item.objectHolder = null;
                            camera.remove(child);
                        }
                    });
                }
            });
        }
    }
    if (controller instanceof CardboardController) {
        if (controller.pickedItems && controller.pickedItems.length > 0) {
            controller.pickedItems.map(item => {

                if (camera.children.length > 0) {
                    camera.children.map(child => {
                        if (child.name === "holder") {
                            item.objectHolder = null;
                            camera.remove(child);
                        }
                    });
                }
            });
        }
    }

    controller.pickedItems = [];
};

let mouseWheelPrevValue = 0;
const objectValueChange = (evt) => {
    let controller = evt.controller;
    mouseWheelPrevValue = mouseWheelPrevValue || 0 ;
    let direction = MouseController.getGamepad().buttons[evt.keyCode - 1].value - mouseWheelPrevValue;
    if (controller instanceof MouseController) {
        let target = evt.target;
        let item = target.object3D;
        if (evt.keyCode === 2) {

            let directionVector = item.getWorldPosition().sub(camera.getWorldPosition());

            if (item.rigidBody) {
                let coef = 0.99;
                coef = direction > 0 ? coef : 1 / coef;
                let pointerShift = directionVector.multiplyScalar(coef).add(camera.getWorldPosition()).multiplyScalar(100);
                let vec = new OIMO.Vec3(pointerShift.x, pointerShift.y, pointerShift.z);
                item.rigidBody.body.sleeping = false;
                item.rigidBody.body.setPosition(vec);
            } else {
                let coef = 0.95;
                coef = direction > 0 ? coef : 1 / coef;
                item.Sculpt.setGlobalPosition(directionVector.multiplyScalar(coef).add(camera.getWorldPosition()));
            }
        }
    }
    mouseWheelPrevValue = MouseController.getGamepad().buttons[evt.keyCode - 1].value;
};

const objectUpdate = function () {
    if (this instanceof MouseController) {
        this.raycaster.setFromCamera({x: this.axes[0], y: this.axes[1]}, camera);

        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                if (this.raycaster.ray.intersectPlane(item.raycastCameraPlane, item.intersection)) {

                    if (this.keyCode === 1) {
                        if (item.rigidBody) {
                            let pointerShift = item.intersection.sub(item.offset).multiplyScalar(100);
                            let vec = new OIMO.Vec3(pointerShift.x, pointerShift.y, pointerShift.z);
                            item.rigidBody.body.sleeping = false;
                            item.rigidBody.body.setPosition(vec);
                        } else {
                            item.Sculpt.setGlobalPosition(item.intersection.sub(item.offset));
                        }
                    } else if (this.keyCode === 3) {
                        let shift = {x: this.axes[0] - item.initMousePos.x, y: this.axes[1] - item.initMousePos.y};
                        item.initMousePos = {x: this.axes[0], y: this.axes[1]};
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
                            let pointerShift = new THREE.Quaternion();
                            pointerShift.multiplyQuaternions(deltaRotationQuaternion, item.getWorldQuaternion());
                            item.Sculpt.setGlobalQuaternion(pointerShift);
                        }
                    }
                }
            });
        }
    }
    if (this instanceof ViveController) {
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                let holderPos = this.raycastingLine.object3D.children[0].getWorldPosition();
                let holderQuat = this.raycastingLine.object3D.children[0].getWorldQuaternion();
                if (item.rigidBody) {
                    if (item.rigidBody.body instanceof OIMO.RigidBody) {
                        item.rigidBody.body.sleeping = false;
                        let vecPos = new OIMO.Vec3(holderPos.x * 100, holderPos.y * 100, holderPos.z * 100);
                        item.rigidBody.body.setPosition(vecPos);

                        let vecQuat = new OIMO.Quaternion(holderQuat.x * 100, holderQuat.y * 100, holderQuat.z * 100, holderQuat.w * 100);
                        item.rigidBody.body.setQuaternion(vecQuat);
                    }
                } else {
                    item.Sculpt.setGlobalPosition(holderPos);
                    item.Sculpt.setGlobalQuaternion(holderQuat);
                }
            });
        }
    }
    if (this instanceof OculusController) {
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                /*if (item.rigidBody) {
                    if (item.rigidBody.body instanceof OIMO.RigidBody) {
                        item.rigidBody.body.sleeping = false;
                        let targetPos = item.objectHolder.getWorldPosition();
                        let vec = new OIMO.Vec3(targetPos.x * 100, targetPos.y * 100, targetPos.z * 100);
                        item.rigidBody.body.setPosition(vec);
                    }
                }*/
                let targetPos = item.objectHolder.getWorldPosition();
                let holderQuat = item.objectHolder.getWorldQuaternion();

                if (item.rigidBody) {
                    if (item.rigidBody.body instanceof OIMO.RigidBody) {
                        item.rigidBody.body.sleeping = false;
                        let vec = new OIMO.Vec3(targetPos.x * 100, targetPos.y * 100, targetPos.z * 100);
                        item.rigidBody.body.setPosition(vec);

                        let vecQuat = new OIMO.Quaternion(holderQuat.x * 100, holderQuat.y * 100, holderQuat.z * 100, holderQuat.w * 100);
                        item.rigidBody.body.setQuaternion(vecQuat);
                    }
                } else {
                    item.Sculpt.setGlobalPosition(targetPos);
                    item.Sculpt.setGlobalQuaternion(holderQuat);
                }
            });
        }
    }
    if (this instanceof CardboardController) {
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                let targetPos = item.objectHolder.getWorldPosition();
                if (item.rigidBody) {
                    if (item.rigidBody.body instanceof OIMO.RigidBody) {
                        item.rigidBody.body.sleeping = false;
                        let vec = new OIMO.Vec3(targetPos.x * 100, targetPos.y * 100, targetPos.z * 100);
                        item.rigidBody.body.setPosition(vec);
                    }
                } else {
                    //item.Sculpt.setGlobalPosition(targetPos);
                    //item.Sculpt.setGlobalQuaternion(holderQuat);
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
}
function ViveControllerKeyUp(keyCode) {
    this.engaged = false;
}

function OculusControllerKeyDown(keyCode) {
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }
}
function OculusControllerKeyUp(keyCode) {
    this.engaged = false;
}

function CardboardControllerKeyDown(keyCode) {
    this.engaged = true;
    if (!this.pickedItems) {
        this.pickedItems = [];
    }
}
function CardboardControllerKeyUp(keyCode) {
    this.engaged = false;
}

function MouseControllerKeyDown(keyCode) {
}
function MouseControllerKeyUp(keyCode) {
}

export const DragAndDrop = {
    objectKeyDown,
    objectValueChange,
    objectUpdate,
    objectKeyUp,
    ViveControllerKeyUp,
    ViveControllerKeyDown,
    OculusControllerKeyDown,
    OculusControllerKeyUp,
    CardboardControllerKeyDown,
    CardboardControllerKeyUp,
    MouseControllerKeyDown,
    MouseControllerKeyUp
};
