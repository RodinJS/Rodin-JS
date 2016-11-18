'use strict';

System.register(['../../_build/js/vendor/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, renderer, scene, boxSize, skybox, camera, controls, effect, params, manager, boxCount, particleBoxSize, geometry, material, cubes, i, lastRender, display;

    function animate(timestamp) {
        var delta = Math.min(timestamp - lastRender, 500);
        lastRender = timestamp;
        //Apply rotation to cube mesh
        for (var i = 0; i < boxCount; i++) {
            cubes[i].rotation.y += delta * 0.001;
        }

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

    // Get the HMD, and if we're dealing with something that specifies
    // stageParameters, rearrange the scene.
    function setupStage() {
        navigator.getVRDisplays().then(function (displays) {
            // console.log(displays);
            if (displays.length > 0) {
                display = displays[0];
                // setInterval(function(){console.log("manager:",manager)}, 2000);
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
        boxSize = Math.max(stage.sizeX, stage.sizeZ);
        skybox = new RODIN.CubeObject(boxSize, 'img/boxW.png');

        skybox.on('ready', function () {
            // Place it on the floor.
            scene.add(skybox.object3D);
            skybox.object3D.position.y = controls.userHeight;
        });

        // Place the cube in the middle of the scene, at user height.
        //  cube.position.set(0, controls.userHeight, 0);
    }
    return {
        setters: [function (_buildJsVendorThreeTHREEGLOBALJs) {
            THREE = _buildJsVendorThreeTHREEGLOBALJs.THREE;
        }, function (_buildJsRodinjsRODINJs) {
            RODIN = _buildJsRodinjsRODINJs;
        }, function (_buildJsVendorThreeExamplesJsControlsVRControlsJs) {}, function (_buildJsVendorThreeExamplesJsEffectsVREffectJs) {}],
        execute: function () {

            console.log(RODIN);

            RODIN.WTF.is('Rodin.JS v0.0.1');

            // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
            // Only enable it if you actually need to.
            renderer = new THREE.WebGLRenderer({ antialias: true });

            renderer.setPixelRatio(window.devicePixelRatio);

            // Append the canvas element created by the renderer to document body element.
            document.body.appendChild(renderer.domElement);

            // Create a three.js scene.
            scene = new THREE.Scene();
            boxSize = 15;
            skybox = new RODIN.CubeObject(boxSize, 'img/boxW.png');
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
            controls = new THREE.VRControls(camera);

            controls.standing = true;

            // Apply VR stereo rendering to renderer.
            effect = new THREE.VREffect(renderer);

            effect.setSize(window.innerWidth, window.innerHeight);

            skybox.on('ready', function () {
                scene.add(skybox.object3D);
                skybox.object3D.position.y = controls.userHeight;
                setupStage();
            });

            // For high end VR devices like Vive and Oculus, take into account the stage
            // parameters provided.

            // Create a VR manager helper to enter and exit VR mode.
            params = {
                hideButton: false, // Default: false.
                isUndistorted: false // Default: false.
            };
            manager = new WebVRManager(renderer, effect, params);
            boxCount = 100;
            particleBoxSize = 0.015;
            geometry = new THREE.BoxGeometry(particleBoxSize, particleBoxSize, particleBoxSize);
            material = new THREE.MeshNormalMaterial();
            cubes = [];

            for (i = 0; i < boxCount; i++) {
                cubes.push(new THREE.Mesh(geometry, material));
                cubes[i].position.set(1.5 * (Math.random() - 0.5), controls.userHeight - 3 * (Math.random() - 0.5), 1.5 * (Math.random() - 0.5));
                scene.add(cubes[i]);
            }

            //Position cube mesh to be right in front of you.
            //cube.position.set(0, controls.userHeight, -1);

            // Add cube mesh to your three.js scene
            //scene.add(cube);

            // Kick off animation loop
            requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);

            // Request animation frame loop function
            lastRender = 0;
        }
    };
});