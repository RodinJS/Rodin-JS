'use strict';

System.register(['../../_build/js/vendor/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/utils/ChangeParent.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js', '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js', '../../_build/js/vendor/three/examples/js/WebVR.js'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, WTF, changeParent, renderer, scene, camera, controls, effect, params, manager, viveControllerL, viveControllerR, loader, mouseController, geometry, material, floor, light, group, geometries, _loop, i, object;

    function controllerKeyDown(keyCode) {
        if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
        this.engaged = true;
        if (!this.pickedItems) {
            this.pickedItems = [];
        }
    }

    function controllerKeyUp(keyCode) {
        if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
        this.engaged = false;
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems = [];
        }
    }

    function controllerTouchDown(keyCode, gamepad) {

        if (!this.engaged || keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY1) return;

        if (this.intersected && this.intersected.length > 0) {
            this.intersected.map(function (intersect) {
                if (!gamepad.initialTouchX && gamepad.initialTouchX != 0) {
                    gamepad.initialTouchX = -gamepad.axes[1];
                    gamepad.initialTouchY = -gamepad.axes[0];
                }

                if (!intersect.initialRotX && intersect.initialRotX != 0) {
                    intersect.initialRotX = +intersect.object3D.parent.rotation.x;
                    intersect.initialRotY = +intersect.object3D.parent.rotation.y;
                }
                var x = intersect.initialRotX + (-gamepad.axes[1] - gamepad.initialTouchX);
                var y = intersect.initialRotY + (-gamepad.axes[0] - gamepad.initialTouchY);

                var directionY = new THREE.Vector3(0, 1, 0).normalize();
                var quaternionY = new THREE.Quaternion();
                quaternionY.setFromAxisAngle(directionY, -y);

                var directionX = new THREE.Vector3(1, 0, 0).normalize();
                var quaternionX = new THREE.Quaternion();
                quaternionX.setFromAxisAngle(directionX, x);

                intersect.object3D.parent.updateMatrixWorld();
                intersect.object3D.parent.quaternion.copy(new THREE.Quaternion().multiplyQuaternions(quaternionX, quaternionY));
            });
        }
    }

    function controllerTouchUp(keyCode, gamepad) {
        if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY1) return;
        if (this.intersected && this.intersected.length > 0) {
            this.intersected.map(function (intersect) {
                gamepad.initialTouchX = null;
                gamepad.initialTouchZ = null;
                intersect.initialRotX = 0;
                intersect.initialRotY = 0;

                var holderObj = intersect.object3D.parent;
                changeParent(intersect.object3D, intersect.object3D.initialParent);
                holderObj.rotation.set(0, 0, 0);
                changeParent(intersect.object3D, holderObj);
            });
        }
    }

    function mouseControllerUpdate() {
        var _this = this;

        this.raycaster.setFromCamera({ x: this.axes[0], y: this.axes[1] }, camera);

        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(function (item) {
                if (_this.raycaster.ray.intersectPlane(item.raycastCameraPlane, item.intersection)) {
                    if (_this.keyCode === 1) {
                        var initParent = item.parent;
                        changeParent(item, scene);
                        item.position.copy(item.intersection.sub(item.offset));
                        changeParent(item, initParent);
                    } else if (_this.keyCode === 3) {
                        var shift = { x: _this.axes[0] - item.initMousePos.x, y: _this.axes[1] - item.initMousePos.y };
                        item.initMousePos = { x: _this.axes[0], y: _this.axes[1] };
                        var _initParent = item.parent;
                        changeParent(item, camera);
                        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(-shift.y * Math.PI, shift.x * Math.PI, 0, 'XYZ'));

                        item.quaternion.multiplyQuaternions(deltaRotationQuaternion, item.quaternion);

                        changeParent(item, _initParent);
                    }
                }
            });
        }
    }

    function mouseControllerKeyDown(keyCode) {

        if (keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) return;
        this.keyCode = keyCode;
        this.engaged = true;
        if (!this.pickedItems) {
            this.pickedItems = [];
        }

        if (this.intersected && this.intersected.length > 0) {
            this.stopPropagation(RODIN.CONSTANTS.EVENT_NAMES.MOUSE_DOWN);
            this.stopPropagation(RODIN.CONSTANTS.EVENT_NAMES.MOUSE_MOVE);
        }
    }

    function mouseControllerKeyUp(keyCode) {
        if (keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) return;
        this.keyCode = null;
        this.engaged = false;
        this.startPropagation(RODIN.CONSTANTS.EVENT_NAMES.MOUSE_DOWN);
        this.startPropagation(RODIN.CONSTANTS.EVENT_NAMES.MOUSE_MOVE);
        this.pickedItems = [];
    }

    // Kick off animation loop


    // Request animation frame loop function
    function animate(timestamp) {

        // Update controller.
        viveControllerL.update();
        viveControllerR.update();
        mouseController.update();

        // Update VR headset position and apply to camera.
        controls.update();

        // Render the scene through the manager.
        manager.render(scene, camera, timestamp);

        requestAnimationFrame(animate);
    }

    function onResize(e) {
        effect.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    return {
        setters: [function (_buildJsVendorThreeTHREEGLOBALJs) {
            THREE = _buildJsVendorThreeTHREEGLOBALJs.THREE;
        }, function (_buildJsRodinjsRODINJs) {
            RODIN = _buildJsRodinjsRODINJs;
            WTF = _buildJsRodinjsRODINJs.WTF;
        }, function (_buildJsRodinjsUtilsChangeParentJs) {
            changeParent = _buildJsRodinjsUtilsChangeParentJs.default;
        }, function (_buildJsVendorThreeExamplesJsControlsVRControlsJs) {}, function (_buildJsVendorThreeExamplesJsEffectsVREffectJs) {}, function (_buildJsVendorThreeExamplesJsLoadersOBJLoaderJs) {}, function (_buildJsVendorThreeExamplesJsWebVRJs) {}],
        execute: function () {

            WTF.is('Rodin.JS v0.0.1');

            /////////////////////////////WebVR Example/////////////////////////////////////

            // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
            // Only enable it if you actually need to.
            renderer = new THREE.WebGLRenderer({ antialias: true });

            renderer.setPixelRatio(window.devicePixelRatio);

            renderer.shadowMap.enabled = true;
            renderer.gammaInput = true;
            renderer.gammaOutput = true;

            // Append the canvas element created by the renderer to document body element.
            document.body.appendChild(renderer.domElement);

            // Create a three.js scene.
            scene = new THREE.Scene();

            scene.background = new THREE.Color(0x808080);

            // Create a three.js camera.
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);


            scene.add(camera);

            // Apply VR headset positional data to camera.
            controls = new THREE.VRControls(camera);

            controls.standing = true;

            // Apply VR stereo rendering to renderer.
            effect = new THREE.VREffect(renderer);

            effect.setSize(window.innerWidth, window.innerHeight);

            // Create a VR manager helper to enter and exit VR mode.
            params = {
                hideButton: false, // Default: false.
                isUndistorted: false // Default: false.
            };
            manager = new WebVRManager(renderer, effect, params);
            viveControllerL = new RODIN.ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, null, 2);

            viveControllerL.standingMatrix = controls.getStandingMatrix();
            viveControllerL.onKeyDown = controllerKeyDown;
            viveControllerL.onKeyUp = controllerKeyUp;
            viveControllerL.onTouchUp = controllerTouchUp;
            viveControllerL.onTouchDown = controllerTouchDown;
            scene.add(viveControllerL);

            viveControllerR = new RODIN.ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, null, 3);

            viveControllerR.standingMatrix = controls.getStandingMatrix();
            viveControllerR.onKeyDown = controllerKeyDown;
            viveControllerR.onKeyUp = controllerKeyUp;
            viveControllerR.onTouchUp = controllerTouchUp;
            viveControllerR.onTouchDown = controllerTouchDown;
            scene.add(viveControllerR);

            loader = new THREE.OBJLoader();

            loader.setPath('./object/');
            loader.load('vr_controller_vive_1_5.obj', function (object) {

                var loader = new THREE.TextureLoader();
                loader.setPath('./img/');

                object.children[0].material.map = loader.load('onepointfive_texture.png');
                object.children[0].material.specularMap = loader.load('onepointfive_spec.png');

                viveControllerL.add(object.clone());
                viveControllerR.add(object.clone());
            });

            mouseController = new RODIN.MouseController();

            mouseController.setRaycasterScene(scene);
            mouseController.setRaycasterCamera(camera);
            mouseController.onKeyDown = mouseControllerKeyDown;
            mouseController.onKeyUp = mouseControllerKeyUp;
            mouseController.onControllerUpdate = mouseControllerUpdate;

            geometry = new THREE.PlaneGeometry(4, 4);
            material = new THREE.MeshStandardMaterial({
                color: 0xeeeeee,
                roughness: 1.0,
                metalness: 0.0
            });
            floor = new THREE.Mesh(geometry, material);

            floor.rotation.x = -Math.PI / 2;
            floor.receiveShadow = true;
            scene.add(floor);

            scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

            light = new THREE.DirectionalLight(0xffffff);

            light.position.set(0, 6, 0);
            light.castShadow = true;
            light.shadow.camera.top = 2;
            light.shadow.camera.bottom = -2;
            light.shadow.camera.right = 2;
            light.shadow.camera.left = -2;
            light.shadow.mapSize.set(4096, 4096);
            scene.add(light);

            // add raycastable objects to scene

            group = new THREE.Group();

            group.position.set(1, 1, 0);
            group.rotation.y = 0.4;
            scene.add(group);

            geometries = [new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.ConeGeometry(0.2, 0.2, 64), new THREE.CylinderGeometry(0.1, 0.1, 0.1, 64), new THREE.IcosahedronGeometry(0.2, 1), new THREE.TorusGeometry(0.2, 0.08, 12, 12)];

            _loop = function _loop() {
                var geometry = geometries[Math.floor(Math.random() * geometries.length)];
                var material = new THREE.MeshStandardMaterial({
                    color: Math.random() * 0xffffff,
                    roughness: 0.7,
                    metalness: 0.0
                });

                object = new THREE.Mesh(geometry, material);


                object.position.x = Math.random() * 4 - 2;
                object.position.y = Math.random() * 2;
                object.position.z = Math.random() * 4 - 2;

                object.rotation.x = Math.random() * 2 * Math.PI;
                object.rotation.y = Math.random() * 2 * Math.PI;
                object.rotation.z = Math.random() * 2 * Math.PI;

                object.castShadow = true;
                object.receiveShadow = true;

                var obj = new RODIN.THREEObject(object);

                obj.on('ready', function () {
                    group.add(obj.object3D);
                    obj.object3D.initialParent = obj.object3D.parent;
                    RODIN.Raycastables.push(obj.object3D);
                });

                // hover

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, function (evt) {
                    console.log(evt);
                    if (evt.controller instanceof RODIN.ViveController) {
                        if (!obj.hoveringObjects) {
                            obj.hoveringObjects = [];
                        }
                        if (obj.hoveringObjects.indexOf(evt.controller) > -1) return;
                        obj.object3D.material.emissive.r = 1;
                        obj.hoveringObjects.push(evt.controller);
                    }

                    if (evt.controller instanceof RODIN.MouseController) {
                        obj.object3D.scale.set(1.2, 1.2, 1.2);
                    }
                });

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, function (evt) {
                    if (evt.controller instanceof RODIN.ViveController) {
                        if (obj.hoveringObjects.indexOf(evt.controller) > -1) {
                            obj.hoveringObjects.splice(obj.hoveringObjects.indexOf(evt.controller));
                        }
                        if (obj.hoveringObjects.length !== 0 || obj.object3D.parent !== obj.object3D.initialParent) {
                            return;
                        }
                        obj.object3D.material.emissive.r = 0;
                    }

                    if (evt.controller instanceof RODIN.MouseController) {
                        obj.object3D.scale.set(1, 1, 1);
                    }
                });

                // CONTROLLER_KEY

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, function (evt) {
                    obj.object3D.scale.set(1.1, 1.1, 1.1);
                    console.log(evt);
                    var controller = evt.controller;
                    var target = evt.target;
                    if (controller instanceof RODIN.MouseController) {
                        controller.pickedItems.push(target.object3D);

                        var initParent = target.object3D.parent;
                        changeParent(target.object3D, scene);

                        target.object3D.raycastCameraPlane = new THREE.Plane();
                        target.object3D.offset = new THREE.Vector3();
                        target.object3D.intersection = new THREE.Vector3();

                        target.object3D.raycastCameraPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(target.object3D.raycastCameraPlane.normal), target.object3D.position);

                        if (controller.raycaster.ray.intersectPlane(target.object3D.raycastCameraPlane, target.object3D.intersection)) {
                            target.object3D.offset.copy(target.object3D.intersection).sub(target.object3D.position);
                            if (evt.keyCode === 3) {
                                var _initParent2 = target.object3D.parent;
                                changeParent(target.object3D, camera);
                                target.object3D.initRotation = target.object3D.rotation.clone();
                                target.object3D.initMousePos = { x: controller.axes[0], y: controller.axes[1] };
                                changeParent(target.object3D, _initParent2);
                            }
                        }
                        changeParent(target.object3D, initParent);
                    } else if (controller instanceof RODIN.ViveController) {
                        if (target.object3D.parent != target.object3D.initialParent) {
                            return;
                        }
                        changeParent(target.object3D, controller.reycastingLine);
                        //let targetParent = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.04, 12, 12));
                        var targetParent = new THREE.Object3D();
                        controller.reycastingLine.add(targetParent);
                        targetParent.position.copy(target.object3D.position);
                        changeParent(target.object3D, targetParent);

                        controller.pickedItems.push(target.object3D);
                        if (target.initialRotX) {
                            target.initialRotX = 0;
                            target.initialRotY = 0;
                        }
                    }
                });

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, function (evt) {
                    obj.object3D.scale.set(1, 1, 1);
                    var controller = evt.controller;
                    var target = evt.target;
                    if (controller instanceof RODIN.MouseController) {} else if (controller instanceof RODIN.ViveController) {
                        var targetParent = target.object3D.parent;
                        changeParent(target.object3D, target.object3D.initialParent);
                        controller.reycastingLine.remove(targetParent);
                    }
                });

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK, function (evt) {
                    if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY1) {}
                    if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) {}
                });

                // Controller touch

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_START, function (evt) {});

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_END, function (evt) {});

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TAP, function (evt) {});
            };

            for (i = 0; i < 50; i++) {
                _loop();
            }requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);
        }
    };
});