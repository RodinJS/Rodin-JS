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

    if (!item.initialParent){
        item.initialParent = item.parent;
    }
    let initialParent = item.initialParent;

    if (controller instanceof MouseController) {

        console.log('objectKeyDown',item);
        console.log('item',item.getWorldPosition().x,item.getWorldPosition().y,item.getWorldPosition().z);
        console.log('item',item.position.x,item.position.y,item.position.z);
        changeParent(item, originalScene);

        console.log('item',item.getWorldPosition().x,item.getWorldPosition().y,item.getWorldPosition().z);
        console.log('item',item.position.x,item.position.y,item.position.z);
        item.raycastCameraPlane = new THREE.Plane();
        item.intersection = new THREE.Vector3();
        item.offset = new THREE.Vector3();

        // console.log('item.getWorldPosition()', item.getWorldPosition());
        item.raycastCameraPlane.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(item.raycastCameraPlane.normal),
            item.getWorldPosition()
        );


        if (controller.raycaster.ray.intersectPlane(item.raycastCameraPlane, item.intersection)) {
            item.offset.copy(item.intersection).sub(item.getWorldPosition());
            console.log('item.intersection', item.intersection);
            console.log('offset', item.offset);
            if (evt.keyCode === 3) {
                let initParent = item.parent;
                changeParent(item, camera);
                item.initRotation = item.rotation.clone();
                item.initMousePos = {x: controller.axes[0], y: controller.axes[1]};
                changeParent(item, initParent);
            }
        }
        changeParent(item, initialParent);
    }
    if (controller instanceof ViveController) {
        if (controller.intersected && controller.intersected.length > 0) {
            controller.intersected.map(intersect => {
                if(item !== intersect.object) {
                    return;
                }
                /*if (item.parent != item.initialParent) {
                    return;
                }*/
                changeParent(item, controller.raycastingLine.object3D);
                let holder = new THREE.Object3D();
                holder.position.copy(item.position);
                holder.quaternion.copy(item.quaternion);
                holder.name = 'holder';
                controller.raycastingLine.object3D.add(holder);

                if (item.rigidBody) {
                    changeParent(item, initialParent);
                } else {
                    changeParent(item, holder);
                }
            });
        }
    }
    if (controller instanceof OculusController) {
        if (controller.intersected && controller.intersected.length > 0) {
            controller.intersected.map(intersect => {
                if(item !== intersect.object) {
                    return;
                }
                changeParent(item, camera);

                let holder = new THREE.Object3D();
                holder.position.copy(item.position);
                holder.name = 'holder';

                camera.add(holder);
                item.objectHolder = holder;

                if (item.rigidBody) {
                    changeParent(item, initialParent);
                } else {
                    changeParent(item, holder);
                }
            })
        }
    }
    if (controller instanceof CardboardController) {
        if (controller.intersected && controller.intersected.length > 0) {
            controller.intersected.map(intersect => {
                if(item !== intersect.object) {
                    return;
                }
                changeParent(item, camera);

                let holder = new THREE.Object3D();
                holder.position.copy(item.position);
                holder.name = 'holder';

                camera.add(holder);
                item.objectHolder = holder;

                if (item.rigidBody) {
                    changeParent(item, initialParent);
                } else {
                    changeParent(item, holder);
                }
            })
        }
    }

    controller.pickedItems.push(item);
};

const objectKeyUp = (evt) => {
    let controller = evt.controller;
    let target = evt.target;
    let item = target.object3D;
    if (!item.initialParent){
        item.initialParent = item.parent;
    }
    let initialParent = item.initialParent;

    if (controller instanceof MouseController) {
    }
    if (controller instanceof ViveController) {
        if (controller.pickedItems && controller.pickedItems.length > 0) {
            controller.pickedItems.map(item => {
                let holder = item.parent;
                changeParent(item, initialParent);
                controller.raycastingLine.object3D.remove(holder);
            });
            if (controller.raycastingLine.object3D.children.length > 0) {
                controller.raycastingLine.object3D.children.map(item => {
                    controller.raycastingLine.object3D.remove(item);
                });
            }
            controller.raycastingLine.object3D.children = [];
        }
    }
    if (controller instanceof OculusController) {
        if (controller.pickedItems && controller.pickedItems.length > 0) {
            controller.pickedItems.map(item => {
                changeParent(item, initialParent);
                item.objectHolder = null;

                if (camera.children.length > 0) {
                    camera.children.map(item => {
                        if (item.name === "holder") {
                            camera.remove(item);
                        }
                    });
                }
            });
        }
    }
    if (controller instanceof CardboardController) {
        if (controller.pickedItems && controller.pickedItems.length > 0) {
            controller.pickedItems.map(item => {
                changeParent(item, initialParent);
                item.objectHolder = null;

                if (camera.children.length > 0) {
                    camera.children.map(item => {
                        if (item.name === "holder") {
                            camera.remove(item);
                        }
                    });
                }
            });
        }
    }

    controller.pickedItems = [];
};

const objectValueChange = (evt) => {
    let controller = evt.controller;

    if (controller instanceof MouseController) {
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

                        console.log('objectUpdate',item.getWorldPosition());
                        changeParent(item, originalScene);
                        console.log('objectUpdate1',item.getWorldPosition());
                        if (item.rigidBody) {
                            let pointerShift = item.intersection.sub(item.offset).multiplyScalar(100);
                            let vec = new OIMO.Vec3(pointerShift.x, pointerShift.y, pointerShift.z);
                            item.rigidBody.body.sleeping = false;
                            item.rigidBody.body.setPosition(vec);
                        } else {
                            item.position.copy(item.intersection.sub(item.offset));
                        }

                        changeParent(item, initParent);
                        console.log('_____________________');
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
                if (item.rigidBody) {
                    if (item.rigidBody.body instanceof OIMO.RigidBody) {
                        item.rigidBody.body.sleeping = false;
                        let holderPos = this.raycastingLine.object3D.children[0].getWorldPosition();
                        let vecPos = new OIMO.Vec3(holderPos.x * 100, holderPos.y * 100, holderPos.z * 100);
                        item.rigidBody.body.setPosition(vecPos);

                        let holderQuat = this.raycastingLine.object3D.children[0].getWorldQuaternion();
                        let vecQuat = new OIMO.Quaternion(holderQuat.x * 100, holderQuat.y * 100, holderQuat.z * 100, holderQuat.w * 100);
                        item.rigidBody.body.setQuaternion(vecQuat);
                    }
                }
            });
        }
    }
    if (this instanceof OculusController) {
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                if (item.rigidBody) {
                    if (item.rigidBody.body instanceof OIMO.RigidBody) {
                        item.rigidBody.body.sleeping = false;
                        let targetPos = item.objectHolder.getWorldPosition();
                        let vec = new OIMO.Vec3(targetPos.x * 100, targetPos.y * 100, targetPos.z * 100);
                        item.rigidBody.body.setPosition(vec);
                    }
                }
            });
        }
    }
    if (this instanceof CardboardController) {
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                if (item.rigidBody) {
                    if (item.rigidBody.body instanceof OIMO.RigidBody) {
                        item.rigidBody.body.sleeping = false;
                        let targetPos = item.objectHolder.getWorldPosition();
                        let vec = new OIMO.Vec3(targetPos.x * 100, targetPos.y * 100, targetPos.z * 100);
                        item.rigidBody.body.setPosition(vec);
                    }
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
