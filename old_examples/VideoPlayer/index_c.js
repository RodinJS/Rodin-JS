'use strict';

System.register(['../../_build/js/vendor/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/utils/timeout.js', '../../_build/js/rodinjs/utils/interval.js', '../../_build/js/rodinjs/video/MaterialPlayer.js', '../../_build/js/rodinjs/utils/Math.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, WTF, timeout, Interval, MaterialPlayer, renderer, scene, camera, controls, effect, player, material, sphere, params, manager, lastRender;

    function animate(timestamp) {
        var delta = Math.min(timestamp - lastRender, 500);
        lastRender = timestamp;
        controls.update();
        manager.render(scene, camera, timestamp);
        player.update(delta);
        RODIN.Objects.map(function (obj) {
            return obj.emit('update', new RODIN.Event(obj));
        });
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
        }, function (_buildJsRodinjsUtilsTimeoutJs) {
            timeout = _buildJsRodinjsUtilsTimeoutJs.timeout;
        }, function (_buildJsRodinjsUtilsIntervalJs) {
            Interval = _buildJsRodinjsUtilsIntervalJs.Interval;
        }, function (_buildJsRodinjsVideoMaterialPlayerJs) {
            MaterialPlayer = _buildJsRodinjsVideoMaterialPlayerJs.MaterialPlayer;
        }, function (_buildJsRodinjsUtilsMathJs) {}, function (_buildJsVendorThreeExamplesJsControlsVRControlsJs) {}, function (_buildJsVendorThreeExamplesJsEffectsVREffectJs) {}],
        execute: function () {

            WTF.is(RODIN);

            WTF.is('Rodin.JS v0.0.1');

            renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 2 });

            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = false;

            document.body.appendChild(renderer.domElement);

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.01, 150);
            controls = new THREE.VRControls(camera);

            controls.standing = true;

            effect = new THREE.VREffect(renderer);

            effect.setSize(window.innerWidth, window.innerHeight);

            player = new MaterialPlayer("video/test1.mp4");
            material = new THREE.MeshBasicMaterial({
                map: player.getTextureL()
            });
            sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(30, 720, 4), material);

            sphere.scale.set(1, 1, -1);
            scene.add(sphere);

            renderer.domElement.addEventListener("click", function () {
                player.playPause();
            });

            params = {
                hideButton: false, // Default: false.
                predistorted: false // Default: false.
            };
            manager = new WebVRManager(renderer, effect, params);


            requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);

            lastRender = 0;
        }
    };
});