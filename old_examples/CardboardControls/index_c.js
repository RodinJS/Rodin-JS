'use strict';

System.register(['../../_build/js/vendor/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/utils/ChangeParent.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js', '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js', '../../_build/js/vendor/three/examples/js/WebVR.js'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, WTF, changeParent, renderer, scene, camera, target, controls, effect, params, manager, controller, geometry, material, floor, light, group, geometries, _loop, i;

    function controllerUpdate() {
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

        target.visible = controller.enabled;
    }

    function controllerKeyDown(keyCode) {
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

    function controllerKeyUp(keyCode) {
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
        controller.update();

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

    ////////////////////////////////////////////////////////////////////////////////////////////////

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
            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
            target = new THREE.Mesh(new THREE.SphereGeometry(0.01, 4, 4), new THREE.MeshBasicMaterial({ color: 0xff0000, depthTest: false }));

            target.position.z = -1;
            target.visible = false;
            camera.add(target);
            scene.add(camera);

            // scene.add(target)

            // Apply VR headset positional data to camera.
            controls = new THREE.VRControls(camera);

            controls.standing = true;

            // Apply VR stereo rendering to renderer.
            effect = new THREE.VREffect(renderer);

            effect.setSize(window.innerWidth, window.innerHeight);

            // Create a VR manager helper to enter and exit VR mode.
            params = {
                hideButton: false, // Default: false.
                isUndistorted: false, // Default: false.
                predistorted: true
            };
            manager = new WebVRManager(renderer, effect, params);
            controller = new RODIN.CardboardController();

            controller.setRaycasterScene(scene);
            controller.setRaycasterCamera(camera);
            controller.onKeyDown = controllerKeyDown;
            controller.onKeyUp = controllerKeyUp;
            controller.onControllerUpdate = controllerUpdate;

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

            geometries = [new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.ConeGeometry(0.2, 0.2, 64), new THREE.CylinderGeometry(0.2, 0.2, 0.2, 64), new THREE.IcosahedronGeometry(0.2, 3), new THREE.TorusGeometry(0.2, 0.04, 64, 32)];

            _loop = function _loop() {

                var geometry = geometries[Math.floor(Math.random() * geometries.length)];
                var material = new THREE.MeshStandardMaterial({
                    color: Math.random() * 0xffffff,
                    roughness: 0.7,
                    metalness: 0.0
                });

                var object = new THREE.Mesh(geometry, material);

                object.position.x = Math.random() * 4 - 2;
                object.position.y = Math.random() * 2;
                object.position.z = Math.random() * 4 - 2;

                object.rotation.x = Math.random() * 2 * Math.PI;
                object.rotation.y = Math.random() * 2 * Math.PI;
                object.rotation.z = Math.random() * 2 * Math.PI;

                object.scale.setScalar(Math.random() + 0.5);

                object.castShadow = true;
                object.receiveShadow = true;

                var obj = new RODIN.THREEObject(object);

                obj.on('ready', function () {
                    group.add(obj.object3D);
                    obj.object3D.initialParent = obj.object3D.parent;
                    RODIN.Raycastables.push(obj.object3D);
                });

                // hover

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, function () {
                    obj.object3D.material.emissive.r = 1;
                });

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, function () {
                    obj.object3D.material.emissive.r = 0;
                });

                // CONTROLLER_KEY
                if (Math.random() > 0.5) {
                    object.material = new THREE.MeshStandardMaterial({
                        color: 0x00ff00,
                        roughness: 0.7,
                        metalness: 0.0
                    });

                    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, function (evt) {
                        evt.target.object3D.initialParent = evt.target.object3D.parent;
                        changeParent(evt.target.object3D, camera);
                    });

                    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, function (evt) {
                        changeParent(evt.target.object3D, evt.target.object3D.initialParent);
                    });
                }

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK, function (evt) {});
            };

            for (i = 0; i < 20; i++) {
                _loop();
            }requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);
        }
    };
});