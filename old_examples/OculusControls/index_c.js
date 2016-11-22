'use strict';

System.register(['../../_build/js/vendor/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/utils/ChangeParent.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js', '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js', '../../_build/js/vendor/three/examples/js/WebVR.js'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, WTF, changeParent, renderer, scene, camera, targetMap, targetMaterial, targetSprite, target, controls, effect, params, manager, raycaster, controller, geometry, material, floor, light, group, geometries, _loop, i;

    function controllerKeyDown(keyCode) {
        var _this = this;

        if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY1) return;
        this.engaged = true;
        if (!this.pickedItems) {
            this.pickedItems = [];
        }

        if (this.intersected && this.intersected.length > 0) {
            this.intersected.map(function (intersect) {
                if (intersect.object3D.parent != intersect.object3D.initialParent) {
                    return;
                }

                changeParent(intersect.object3D, target);
                //let targetParent = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.04, 12, 12));
                var targetParent = new THREE.Object3D();
                target.add(targetParent);
                targetParent.position.copy(intersect.object3D.position);
                changeParent(intersect.object3D, targetParent);

                _this.pickedItems.push(intersect.object3D);
                if (intersect.initialRotX) {
                    intersect.initialRotX = 0;
                    intersect.initialRotY = 0;
                }
            });
        }

        this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, null, keyCode, this);
    }

    function controllerKeyUp(keyCode) {
        if (keyCode !== RODIN.CONSTANTS.KEY_CODES.KEY1) return;
        this.engaged = false;
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(function (item) {
                var targetParent = item.parent;
                changeParent(item, item.initialParent);
                target.remove(targetParent);
            });
            this.pickedItems = [];
        }
        this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, null, keyCode, this);
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
            targetMap = new THREE.TextureLoader().load("./img/target.png");
            targetMaterial = new THREE.SpriteMaterial({ map: targetMap, color: 0xffffff, opacity: 1, depthTest: false });
            targetSprite = new THREE.Sprite(targetMaterial);

            targetSprite.scale.set(0.01, 0.01, 0.01);

            target = new THREE.Object3D();

            target.add(targetSprite);
            target.position.set(0, 0, -1);
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
                isUndistorted: false // Default: false.
            };
            manager = new WebVRManager(renderer, effect, params);
            raycaster = void 0;
            controller = new RODIN.OculusController();

            controller.setRaycasterScene(scene);
            controller.setRaycasterCamera(camera);
            // scene.add( controller );

            raycaster = new RODIN.Raycaster(scene);

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

            scene.add(group);

            geometries = [new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.ConeGeometry(0.2, 0.2, 64), new THREE.CylinderGeometry(0.2, 0.2, 0.2, 64), new THREE.IcosahedronGeometry(0.2, 3), new THREE.TorusGeometry(0.2, 0.04, 64, 32)];

            _loop = function _loop(i) {

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
                    obj.object3D.material.emissive.r = 1;
                });

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, function (evt) {
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
                    console.log(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN + " Event, KeyCode " + evt.keyCode);

                    if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY1) {}
                    if (evt.keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) {}
                });

                // Controller touch
                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_START, function (evt) {});
                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TOUCH_END, function (evt) {});
                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_TAP, function (evt) {});
            };

            for (i = 0; i < 50; i++) {
                _loop(i);
            }

            controller.onKeyDown = controllerKeyDown;
            controller.onKeyUp = controllerKeyUp;requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);
        }
    };
});