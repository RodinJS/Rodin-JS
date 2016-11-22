'use strict';

System.register(['../../_build/js/vendor/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/utils/ChangeParent.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js', '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js', '../../_build/js/vendor/three/examples/js/WebVR.js'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, WTF, changeParent, renderer, scene, camera, controls, effect, params, manager, controllerL, controllerR, loader, geometry, material, floor, light, group, geometries, _loop, i, object;

    function controllerKeyDown(keyCode) {
        var _this = this;

        if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
        this.engaged = true;
        if (!this.pickedItems) {
            this.pickedItems = [];
        }

        if (this.intersected && this.intersected.length > 0) {
            this.intersected.map(function (intersect) {
                if (intersect.object3D.parent != intersect.object3D.initialParent) {
                    return;
                }

                changeParent(intersect.object3D, _this.reycastingLine);
                //let targetParent = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.04, 12, 12));
                var targetParent = new THREE.Object3D();
                _this.reycastingLine.add(targetParent);
                targetParent.position.copy(intersect.object3D.position);
                changeParent(intersect.object3D, targetParent);

                _this.pickedItems.push(intersect.object3D);
                if (intersect.initialRotX) {
                    intersect.initialRotX = 0;
                    intersect.initialRotY = 0;
                }
            });
        }
    }

    function controllerKeyUp(keyCode) {
        var _this2 = this;

        if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY2) return;
        this.engaged = false;
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(function (item) {
                var targetParent = item.parent;
                changeParent(item, item.initialParent);
                _this2.reycastingLine.remove(targetParent);
            });
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

    // Kick off animation loop


    // Request animation frame loop function
    function animate(timestamp) {

        // Update controller.
        controllerL.update();
        controllerR.update();

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

            console.log(RODIN);

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
            controllerL = new RODIN.ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, null, 2);

            controllerL.standingMatrix = controls.getStandingMatrix();
            controllerL.onKeyDown = controllerKeyDown;
            controllerL.onKeyUp = controllerKeyUp;
            controllerL.onTouchUp = controllerTouchUp;
            controllerL.onTouchDown = controllerTouchDown;
            scene.add(controllerL);

            controllerR = new RODIN.ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, null, 3);

            controllerR.standingMatrix = controls.getStandingMatrix();
            controllerR.onKeyDown = controllerKeyDown;
            controllerR.onKeyUp = controllerKeyUp;
            controllerR.onTouchUp = controllerTouchUp;
            controllerR.onTouchDown = controllerTouchDown;
            scene.add(controllerR);

            loader = new THREE.OBJLoader();

            loader.setPath('./object/');
            loader.load('vr_controller_vive_1_5.obj', function (object) {

                var loader = new THREE.TextureLoader();
                loader.setPath('./img/');

                object.children[0].material.map = loader.load('onepointfive_texture.png');
                object.children[0].material.specularMap = loader.load('onepointfive_spec.png');

                controllerL.add(object.clone());
                controllerR.add(object.clone());
            });

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


                object.position.x = (Math.random() - 0.5) * 2;
                object.position.y = (Math.random() - 0.5) * 2;
                object.position.z = (Math.random() - 0.5) * 2;

                object.rotation.x = (Math.random() - 0.5) * 2 * Math.PI;
                object.rotation.y = (Math.random() - 0.5) * 2 * Math.PI;
                object.rotation.z = (Math.random() - 0.5) * 2 * Math.PI;

                object.scale.set(1, 1, 1);

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
                    if (!obj.hoveringObjects) {
                        obj.hoveringObjects = [];
                    }
                    if (obj.hoveringObjects.indexOf(evt.controller) > -1) return;
                    obj.object3D.material.emissive.r = 1;
                    obj.hoveringObjects.push(evt.controller);
                });

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, function (evt) {
                    if (obj.hoveringObjects.indexOf(evt.controller) > -1) {
                        obj.hoveringObjects.splice(obj.hoveringObjects.indexOf(evt.controller));
                    }
                    if (obj.hoveringObjects.length !== 0 || obj.object3D.parent !== obj.object3D.initialParent) {
                        return;
                    }
                    obj.object3D.material.emissive.r = 0;
                });

                // CONTROLLER_KEY

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, function (evt) {
                    obj.object3D.scale.set(1.1, 1.1, 1.1);
                });

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, function (evt) {
                    obj.object3D.scale.set(1, 1, 1);
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

            for (i = 0; i < 12; i++) {
                _loop();
            }requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);
        }
    };
});