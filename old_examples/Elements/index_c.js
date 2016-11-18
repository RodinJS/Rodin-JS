'use strict';

System.register(['../../_build/js/rodinjs/RODIN.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js', '../../_build/js/vendor/three/examples/js/WebVR.js'], function (_export, _context) {
    "use strict";

    var RODIN, renderer, scene, camera, controls, effect, managerParams, manager, raycaster, controller, geometry, material, floor, light, params, button;


    /*function controllerUpdate() {
        let mouse = this.getGamepad();
        this.raycaster.setFromCamera( {x:mouse.axes[0], y:mouse.axes[1]}, camera );
    
        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(item => {
                if ( this.raycaster.ray.intersectPlane( item.raycastCameraPlane, item.intersection ) ) {
                    if(this.keyCode === 1){
                        item.position.copy( item.intersection.sub( item.offset ) );
                    } else if(this.keyCode === 3){
                        let shift = item.intersection.sub( item.offset ).sub( item.position );
                        let initParent = item.parent;
                        changeParent(item, camera);
                        item.rotation.x = item.initRotation.x - 4*shift.y;
                        item.rotation.y = item.initRotation.y - 5*shift.x;
                        item.rotation.z = item.initRotation.z;
                        console.log(item.rotation );
                        changeParent(item, initParent);
    
                    }
                }
            });
        }
    }*/
    function controllerUpdate() {
        var _this = this;

        var mouse = this.getGamepad();
        this.raycaster.setFromCamera({ x: mouse.axes[0], y: mouse.axes[1] }, camera);

        if (this.pickedItems && this.pickedItems.length > 0) {
            this.pickedItems.map(function (item) {
                if (_this.raycaster.ray.intersectPlane(item.raycastCameraPlane, item.intersection)) {
                    if (_this.keyCode === 1) {
                        item.position.copy(item.intersection.sub(item.offset));
                    } else if (_this.keyCode === 3) {
                        var shift = { x: mouse.axes[0] - item.initMousePos.x, y: mouse.axes[1] - item.initMousePos.y };
                        item.initMousePos = { x: mouse.axes[0], y: mouse.axes[1] };
                        var initParent = item.parent;
                        changeParent(item, camera);
                        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(-shift.y * Math.PI, shift.x * Math.PI, 0, 'XYZ'));

                        item.quaternion.multiplyQuaternions(deltaRotationQuaternion, item.quaternion);

                        changeParent(item, initParent);
                    }
                }
            });
        }
    }

    function controllerKeyDown(keyCode) {
        var _this2 = this;

        console.log(keyCode);
        if (keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) return;
        this.keyCode = keyCode;
        this.engaged = true;
        if (!this.pickedItems) {
            this.pickedItems = [];
        }

        if (this.intersected && this.intersected.length > 0) {
            (function () {
                var mouse = _this2.getGamepad();
                mouse.stopPropagationOnMouseDown = true;
                mouse.stopPropagationOnMouseMove = true;

                _this2.intersected.map(function (intersect) {
                    _this2.pickedItems.push(intersect.object3D);

                    intersect.object3D.raycastCameraPlane = new THREE.Plane();
                    intersect.object3D.offset = new THREE.Vector3();
                    intersect.object3D.intersection = new THREE.Vector3();

                    intersect.object3D.raycastCameraPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(intersect.object3D.raycastCameraPlane.normal), intersect.object3D.position);

                    if (_this2.raycaster.ray.intersectPlane(intersect.object3D.raycastCameraPlane, intersect.object3D.intersection)) {
                        intersect.object3D.offset.copy(intersect.object3D.intersection).sub(intersect.object3D.position);
                        if (keyCode === 3) {
                            var initParent = intersect.object3D.parent;
                            changeParent(intersect.object3D, camera);
                            intersect.object3D.initRotation = intersect.object3D.rotation.clone();
                            intersect.object3D.initMousePos = { x: mouse.axes[0], y: mouse.axes[1] };
                            changeParent(intersect.object3D, initParent);
                        }
                    }
                });
            })();
        }

        this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, null, keyCode, this);
    }

    function controllerKeyUp(keyCode) {
        if (keyCode === RODIN.CONSTANTS.KEY_CODES.KEY2) return;
        this.keyCode = null;
        this.engaged = false;
        this.getGamepad().stopPropagationOnMouseDown = false;
        this.getGamepad().stopPropagationOnMouseMove = false;
        this.pickedItems = [];
        this.raycastAndEmitEvent(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, null, keyCode, this);
    }

    // Kick off animation loop


    // Request animation frame loop function
    function animate(timestamp) {

        // Update controller.
        controller.update();
        if (button.object3D) button.object3D.rotation.y += 0.01;

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
        setters: [function (_buildJsRodinjsRODINJs) {
            RODIN = _buildJsRodinjsRODINJs;
        }, function (_buildJsVendorThreeExamplesJsControlsVRControlsJs) {}, function (_buildJsVendorThreeExamplesJsEffectsVREffectJs) {}, function (_buildJsVendorThreeExamplesJsWebVRJs) {}],
        execute: function () {

            console.log(RODIN);

            RODIN.WTF.is('Rodin.JS v0.0.1');

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


            scene.add(camera);

            // scene.add(target)

            // Apply VR headset positional data to camera.
            controls = new THREE.VRControls(camera);

            controls.standing = true;

            // Apply VR stereo rendering to renderer.
            effect = new THREE.VREffect(renderer);

            effect.setSize(window.innerWidth, window.innerHeight);

            // Create a VR manager helper to enter and exit VR mode.
            managerParams = {
                hideButton: false, // Default: false.
                isUndistorted: false // Default: false.
            };
            manager = new WebVRManager(renderer, effect, managerParams);
            controller = new RODIN.MouseController();

            controller.setRaycasterScene(scene);
            controller.setRaycasterCamera(camera);

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

            params = {};

            params.name = "name_";
            params.width = 0.7;
            params.height = 0.4;
            params.background = {
                color: 0xffffff,
                opacity: 0.8,
                image: {
                    url: "./img/test.jpg"
                }
            };
            params.border = {
                width: 0.01,
                color: 0x00ff00,
                radius: 0.02
            };
            params.label = {
                text: "Button 1",
                fontFamily: "Arial",
                fontSize: 0.1,
                color: 0xffffff,
                opacity: 1,
                position: { h: 30, v: 30 }
            };
            params.image = {
                url: "./img/target.png",
                width: 0.2,
                height: 0.2,
                opacity: 0.5,
                position: { h: 0, v: 20 }
            };

            button = new RODIN.Button(params);

            button.on('ready', function (evt) {
                var object = button.object3D;
                object.position.y = controls.userHeight;
                object.position.z = -1;

                object.castShadow = true;
                object.receiveShadow = true;
                scene.add(object);
            });

            /*    obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, () => {
                    obj.object3D.material.emissive.r = 1;
                });
            
                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
                    obj.object3D.material.emissive.r = 0;
                });
            
                // CONTROLLER_KEY
            
                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
                    //console.log(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN + " Event, KeyCode " + evt.keyCode);
                });
            
                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
                    //console.log(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_UP + " Event, KeyCode " + evt.keyCode);
                });
            
                obj.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK, (evt) => {
                    //console.log(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_CLICK + " Event, KeyCode " + evt.keyCode);
                });*/

            controller.onKeyDown = controllerKeyDown;
            controller.onKeyUp = controllerKeyUp;
            controller.onControllerUpdate = controllerUpdate;requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);
        }
    };
});