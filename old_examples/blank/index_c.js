'use strict';

System.register(['../../_build/js/rodinjs/RODIN.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js'], function (_export, _context) {
    "use strict";

    var RODIN, renderer, scene, camera, controls, effect, params, manager, lastRender, display;

    function animate(timestamp) {
        // delta is used to tell your updating functions
        // how much time has elapsed since last update
        // it is recommended to use delta in animation logic
        // to maintain stable speed across all fps situations
        var delta = Math.min(timestamp - lastRender, 500);
        lastRender = timestamp;

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
            if (displays.length > 0) {
                display = displays[0];
                if (display.stageParameters) {
                    setStageDimensions(display.stageParameters);
                }
            }
        });
    }

    function setStageDimensions(stage) {
        if (stage.sizeX === 0 || stage.sizeZ === 0) return;
        // Make the environment fit the stage.
    }
    return {
        setters: [function (_buildJsRodinjsRODINJs) {
            RODIN = _buildJsRodinjsRODINJs;
        }, function (_buildJsVendorThreeExamplesJsControlsVRControlsJs) {}, function (_buildJsVendorThreeExamplesJsEffectsVREffectJs) {}],
        execute: function () {
            renderer = new THREE.WebGLRenderer({ antialias: false });

            renderer.setPixelRatio(window.devicePixelRatio);

            // Append the canvas element created by the renderer to document body element.
            document.body.appendChild(renderer.domElement);

            // Create a three.js scene.
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
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


            /*
            
            Your main code goes here
            
            */

            // Kick off animation loop
            requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);

            // Request animation frame loop function
            lastRender = 0;
        }
    };
});