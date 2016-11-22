'use strict';

System.register(['../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/utils/Math.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js'], function (_export, _context) {
    "use strict";

    var RODIN, renderer, ua, focalLength, scene, camera, controls, snowContainer, effect, boxSize, snowBoxSize, skybox, snow, params, manager, geometry1, texture1, material1, object1, obj, lastRender, display;

    function animate(timestamp) {
        var delta = Math.min(timestamp - lastRender, 500);
        lastRender = timestamp;
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

    // Get the HMD, and if we're dealing with something that specifies
    // stageParameters, rearrange the scene.
    function setupStage() {
        if (!navigator.getVRDisplays) return;
        navigator.getVRDisplays().then(function (displays) {
            if (displays.length > 0) {
                display = displays[0];
                if (display.stageParameters) {
                    setStageDimensions(display.stageParameters);
                }
            }
        });
    }

    function setStageDimensions(stage) {
        // Make the skybox fit the stage.
        if (stage.sizeX === 0 || stage.sizeZ === 0) return;

        scene.remove(skybox.object3D);

        // Size the skybox according to the size of the actual stage.
        boxSize = Math.max(stage.sizeX, stage.sizeY);
        var skybox = new RODIN.CubeObject(boxSize, 'img/boxW.png');

        skybox.on('ready', function () {
            scene.add(skybox.object3D);
            skybox.object3D.position.y = boxSize / 2 - controls.userHeight;
            skybox.object3D.add(snowContainer);
            snowContainer.position.y = -boxSize / 2 + snowBoxSize / 2;
        });

        // Place it on the floor.
        skybox.object3D.position.y = boxSize / 2;
        scene.add(skybox.object3D);

        // Place the cube in the middle of the scene, at user height.
        // cube.position.set(0, controls.userHeight, 0);
    }
    return {
        setters: [function (_buildJsRodinjsRODINJs) {
            RODIN = _buildJsRodinjsRODINJs;
        }, function (_buildJsRodinjsUtilsMathJs) {}, function (_buildJsVendorThreeExamplesJsControlsVRControlsJs) {}, function (_buildJsVendorThreeExamplesJsEffectsVREffectJs) {}],
        execute: function () {

            console.log(RODIN); //import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';


            RODIN.WTF.is('Rodin.JS v0.0.1');

            // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
            // Only enable it if you actually need to.
            renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 2 });

            renderer.setPixelRatio(window.devicePixelRatio);

            // Append the canvas element created by the renderer to document body element.
            document.body.appendChild(renderer.domElement);
            ua = navigator.userAgent || navigator.vendor || window.opera;
            focalLength = 3;
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
            controls = new THREE.VRControls(camera);

            controls.standing = true;

            snowContainer = new THREE.Object3D();
            effect = new THREE.VREffect(renderer);

            effect.setSize(window.innerWidth, window.innerHeight);

            // Add a skybox.
            boxSize = 21;
            snowBoxSize = 18;
            skybox = new RODIN.CubeObject(boxSize, 'img/portals/frozen/room/bg/SD/horizontalSkyBox1.jpg');


            skybox.on('ready', function () {
                scene.add(skybox.object3D);
                skybox.object3D.position.y = controls.userHeight;
                skybox.object3D.rotation.y = -Math.PI / 2;
                skybox.object3D.add(snowContainer);
                snowContainer.rotation.y = -Math.PI / 2;
                snowContainer.position.y = -boxSize / 2 + snowBoxSize / 2;
                scene.add(object1);

                // For high end VR devices like Vive and Oculus, take into account the stage
                // parameters provided.
                setupStage();
            });

            //snow = new RODIN.Snow(
            //    id,
            //    snow flake image URL,
            //    snow Box size in m,
            //    flake size in m,
            //    numer of flakes in a cube of 1m x 1m x 1m ,
            //    windspeed in m/s,
            //    graviti value
            //);

            snow = new RODIN.Snow(0, 'img/particle_snow2.png', snowBoxSize, 0.03, 3, 0.2, 1);


            snow.on("ready", function (evt) {
                evt.target.object3D.renderOrder = 1;
                snowContainer.add(evt.target.object3D);
            });

            // Create a VR manager helper to enter and exit VR mode.
            params = {
                hideButton: false, // Default: false.
                isUndistorted: false // Default: false.
            };
            manager = new WebVRManager(renderer, effect, params);
            geometry1 = new THREE.PlaneGeometry(10, 12, 2, 2);
            texture1 = new THREE.TextureLoader().load("img/portals/frozen/characters.png");
            material1 = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                map: texture1,
                transparent: true,
                depthWrite: false
            });
            object1 = new THREE.Mesh(geometry1, material1);

            object1.position.x = 0;
            object1.position.y = 0;
            object1.position.z = -9.5;
            //object1.rotation.y = Math.PI;
            object1.scale.set(.5, .5, .5);
            console.log(object1);
            obj = new RODIN.THREEObject(object1);


            obj.on('ready', function () {});

            // Kick off animation loop
            requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);

            // Request animation frame loop function
            lastRender = 0;
        }
    };
});