'use strict';

System.register(['../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/utils/Math.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js', '../../_build/js/vendor/three/examples/js/ImprovedNoise.js', '../../_build/js/vendor/three/examples/js/SkyShader.js', '../../_build/js/vendor/three/examples/js/loaders/OBJLoader.js', '../../_build/js/vendor/three/examples/js/WebVR.js', '../../_build/js/rodinjs/utils/ChangeParent.js'], function (_export, _context) {
    "use strict";

    var RODIN, changeParent, renderer, ua, scene, boxSize, skybox, camera, controls, snowContainer, effect, params, manager, viveControllerL, viveControllerR, loader, mouseController, snowBoxSize, snow, light1, terrain, s, christmasTree, tree, toyURLS, toyReady, colors, _loop, i, toy, lastRender;

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
                        var _initParent2 = item.parent;
                        changeParent(item, camera);
                        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(-shift.y * Math.PI, shift.x * Math.PI, 0, 'XYZ'));

                        item.quaternion.multiplyQuaternions(deltaRotationQuaternion, item.quaternion);

                        changeParent(item, _initParent2);
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

    function animate(timestamp) {
        var delta = Math.min(timestamp - lastRender, 500);
        lastRender = timestamp;

        // Update controller.
        viveControllerL.update();
        viveControllerR.update();
        mouseController.update();

        // Update VR headset position and apply to camera.
        controls.update();
        snow.emit('update');

        // Render the scene through the manager.
        manager.render(scene, camera, timestamp);
        requestAnimationFrame(animate);
    }

    function onResize(e) {
        effect.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        if (window.devicePixelRatio >= 2) {
            manager.renderer.setPixelRatio(2);
        }
    }
    return {
        setters: [function (_buildJsRodinjsRODINJs) {
            RODIN = _buildJsRodinjsRODINJs;
        }, function (_buildJsRodinjsUtilsMathJs) {}, function (_buildJsVendorThreeExamplesJsControlsVRControlsJs) {}, function (_buildJsVendorThreeExamplesJsEffectsVREffectJs) {}, function (_buildJsVendorThreeExamplesJsImprovedNoiseJs) {}, function (_buildJsVendorThreeExamplesJsSkyShaderJs) {}, function (_buildJsVendorThreeExamplesJsLoadersOBJLoaderJs) {}, function (_buildJsVendorThreeExamplesJsWebVRJs) {}, function (_buildJsRodinjsUtilsChangeParentJs) {
            changeParent = _buildJsRodinjsUtilsChangeParentJs.default;
        }],
        execute: function () {

            console.log(RODIN); //import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';


            RODIN.WTF.is('Rodin.JS v0.0.1');

            // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
            // Only enable it if you actually need to.
            renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 2 });

            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = false;

            // Append the canvas element created by the renderer to document body element.
            document.body.appendChild(renderer.domElement);
            ua = navigator.userAgent || navigator.vendor || window.opera;
            scene = new THREE.Scene();
            boxSize = 30;
            skybox = new THREE.Mesh(new THREE.BoxGeometry(boxSize * 2, boxSize * 2, boxSize * 2), new THREE.MeshBasicMaterial({ color: 0x000000 }));

            scene.fog = new THREE.Fog(0x7a8695, 0, 23);

            // Create a three.js camera.
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
            controls = new THREE.VRControls(camera);

            controls.standing = true;

            scene.add(skybox);
            skybox.position.y = controls.userHeight;
            skybox.scale.set(1, 1, -1);

            snowContainer = new THREE.Object3D();
            effect = new THREE.VREffect(renderer);

            effect.setSize(window.innerWidth, window.innerHeight);

            // Create a VR manager helper to enter and exit VR mode.
            params = {
                hideButton: false, // Default: false.
                isUndistorted: true // Default: false.
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

            loader.setPath('./models/');
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

            // Add a skybox.
            boxSize = 21;
            snowBoxSize = 18;


            snowContainer.rotation.y = -Math.PI / 2;
            snowContainer.position.y = -boxSize / 2 + snowBoxSize / 2;

            //snow = new RODIN.Snow(
            //    id,
            //    snow flake image URL,
            //    snow Box size in m,
            //    flake size in m,
            //    number of flakes in a cube of 1m x 1m x 1m ,
            //    windspeed in m/s,
            //    gravity value
            //);
            snow = new RODIN.Snow(0, 'img/particle_snow2.png', snowBoxSize, 0.03, 3, 0.2, 1);


            snow.on("ready", function (evt) {
                evt.target.object3D.renderOrder = 1;
                snowContainer.add(evt.target.object3D);
                scene.add(snowContainer);
            });

            light1 = new THREE.DirectionalLight(0xbbbbbb);

            light1.position.set(0, 6, 1);
            light1.castShadow = true;
            light1.shadow.camera.top = 15;
            light1.shadow.camera.bottom = -15;
            light1.shadow.camera.right = 15;
            light1.shadow.camera.left = -15;
            light1.shadow.mapSize.set(2048, 2048);
            scene.add(light1);

            scene.add(new THREE.AmbientLight(0xaaaaaa));

            //terrain
            terrain = new RODIN.JSONModelObject(0, "./models/terrain.json");

            terrain.on('ready', function () {
                var textureSnow = new THREE.TextureLoader().load("./models/snow_texture.jpg");
                textureSnow.wrapS = THREE.RepeatWrapping;
                textureSnow.wrapT = THREE.RepeatWrapping;
                textureSnow.repeat.x = 15;
                textureSnow.repeat.y = 15;
                var mesh = new THREE.Mesh(terrain.object3D.geometry, new THREE.MeshLambertMaterial({
                    color: 0xbbbbbb,
                    map: textureSnow,
                    clipShadows: true
                }));

                mesh.scale.set(0.3, 0.4, 0.3);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                scene.add(mesh);
            });

            s = 0.05;
            christmasTree = new RODIN.JSONModelObject(0, './models/christmasTree.json');

            christmasTree.on('ready', function () {
                christmasTree.object3D.material.materials[0].alphaTest = 0.35;
                christmasTree.object3D.material.materials[0].transparent = false;
                christmasTree.object3D.material.materials[0].side = THREE.DoubleSide;
                christmasTree.object3D.material.materials[0].clipShadows = true;

                christmasTree.object3D.scale.set(s, s, s);
                christmasTree.object3D.position.x = 0.5;
                christmasTree.object3D.position.y = 0;
                christmasTree.object3D.position.z = 0.5;

                christmasTree.object3D.castShadow = true;
                christmasTree.object3D.receiveShadow = true;
                scene.add(christmasTree.object3D);
            });

            // random tree
            tree = new RODIN.JSONModelObject(0, './models/tree.json');

            tree.on('ready', function () {
                for (var i = 0; i < 25; i++) {
                    var _s = Math.randomFloatIn(0.05, 0.15);
                    var t = tree.object3D.clone();
                    var alpha = Math.randomFloatIn(-Math.PI, Math.PI);

                    t.position.x = (Math.sin(alpha) + _s) * Math.randomFloatIn(9, 20);
                    t.position.y = 0;
                    t.position.z = (Math.cos(alpha) + _s) * Math.randomFloatIn(9, 20);
                    t.rotation.y = (Math.random() - 0.5) * 2 * Math.PI / 2;
                    t.scale.set(_s, _s, _s);

                    t.castShadow = true;
                    t.receiveShadow = true;
                    scene.add(t);
                }
            });

            // christmasTree toys
            toyURLS = ['./models/bell.json', './models/candy.json', './models/toyDuploCone.json', './models/toySphereBig.json', './models/toySphereMiddle.json', './models/toySphereSmall.json', './models/star.json'];

            toyReady = function toyReady() {
                var obj = new RODIN.THREEObject(this.object3D);
                var k = Math.randomFloatIn(-0.1, -1.0);
                var alpha = Math.randomFloatIn(-Math.PI, Math.PI);

                obj.object3D.position.x = (Math.sin(alpha) + s) * k;
                obj.object3D.position.y = s;
                obj.object3D.position.z = (Math.cos(alpha) + s) * k;
                obj.object3D.rotation.y = (Math.random() - 0.5) * 2 * Math.PI / 2;
                obj.object3D.scale.set(s, s, s);

                obj.object3D.castShadow = true;
                obj.object3D.receiveShadow = true;

                scene.add(obj.object3D);
                RODIN.Raycastables.push(obj.object3D);
                obj.object3D.initialParent = obj.object3D.parent;

                // hover
                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, function (evt) {
                    if (evt.controller instanceof RODIN.ViveController) {
                        if (!obj.hoveringObjects) {
                            obj.hoveringObjects = [];
                        }
                        if (obj.hoveringObjects.indexOf(evt.controller) > -1) return;
                        obj.hoveringObjects.push(evt.controller);
                    }

                    if (evt.controller instanceof RODIN.MouseController) {}
                });

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, function (evt) {
                    if (evt.controller instanceof RODIN.ViveController) {
                        if (obj.hoveringObjects.indexOf(evt.controller) > -1) {
                            obj.hoveringObjects.splice(obj.hoveringObjects.indexOf(evt.controller));
                        }
                        if (obj.hoveringObjects.length !== 0 || obj.object3D.parent !== obj.object3D.initialParent) {
                            return;
                        }
                    }

                    if (evt.controller instanceof RODIN.MouseController) {}
                });

                // CONTROLLER_KEY
                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, function (evt) {
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
                                var _initParent = target.object3D.parent;
                                changeParent(target.object3D, camera);
                                target.object3D.initRotation = target.object3D.rotation.clone();
                                target.object3D.initMousePos = { x: controller.axes[0], y: controller.axes[1] };
                                changeParent(target.object3D, _initParent);
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
                    var controller = evt.controller;
                    var target = evt.target;
                    if (controller instanceof RODIN.MouseController) {} else if (controller instanceof RODIN.ViveController) {
                        var targetParent = target.object3D.parent;
                        changeParent(target.object3D, target.object3D.initialParent);
                        controller.reycastingLine.remove(targetParent);
                    }
                });

                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_VALUE_CHANGE, function (evt) {

                    var controller = evt.controller;
                    var target = evt.target;
                    if (controller instanceof RODIN.MouseController) {
                        var gamePad = RODIN.MouseController.getGamepad();
                        if (evt.keyCode === 2) {
                            var initParent = target.object3D.parent;
                            changeParent(target.object3D, camera);
                            target.object3D.position.z -= gamePad.buttons[evt.keyCode - 1].value / 1000;
                            gamePad.buttons[evt.keyCode - 1].value = 0;
                            changeParent(target.object3D, initParent);
                        }
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

            colors = [0x0d2a70, 0x690000, 0xd2d2d2];

            _loop = function _loop(i) {
                var url = toyURLS[Math.randomIntIn(0, 5)];
                var toy = new RODIN.JSONModelObject(i, url);

                toy.on('ready', toyReady);
                toy.on('ready', function () {
                    toy.object3D.geometry.computeVertexNormals();

                    toy.object3D.material.materials[0].reflectivity = 1;
                    toy.object3D.material.materials[0].hue = 1;
                    if (url !== toyURLS[1]) {
                        toy.object3D.material.materials[0].color = new THREE.Color(colors[Math.randomIntIn(0, colors.length - 1)]);
                    }
                });
            };

            for (i = 0; i < 10; i++) {
                _loop(i);
            }

            toy = new RODIN.JSONModelObject(10, toyURLS[6]);

            toy.on('ready', toyReady);
            toy.on('ready', function () {
                toy.object3D.geometry.center();
                var toyGeo = toy.object3D.geometry.clone();
                var glowMat = new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load("./models/star.png"),
                    lights: true,
                    blending: THREE.AdditiveBlending,
                    opacity: 0.75,
                    transparent: true
                });
                var toyGlow = new THREE.Mesh(toyGeo, glowMat);
                toyGlow.scale.multiplyScalar(1.5);
                toyGlow.geometry.center();
                toy.object3D.add(toyGlow);
                console.log(toyGlow);
            });requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);

            // Request animation frame loop function
            lastRender = 0;
        }
    };
});