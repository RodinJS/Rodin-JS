'use strict';

System.register(['../../_build/js/vendor/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/utils/timeout.js', '../../_build/js/rodinjs/utils/interval.js', '../../_build/js/rodinjs/utils/Math.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, WTF, timeout, Interval, renderer, scene, camera, controls, effect, skybox, boxSize, snowObject, loader, params, manager, light1, light2, amlight, lastRender, display;


    function onTextureLoaded(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(boxSize, boxSize);
        var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, boxSize, boxSize, boxSize);

        var material = new THREE.MeshBasicMaterial({
            color: 0x003300,
            wireframe: true
        });

        skybox = new THREE.Mesh(geometry, material);

        scene.add(skybox);
        skybox.position.y = boxSize / 2 - controls.userHeight;
        setupStage();

        var snow = new RODIN.Snow(0, 'img/particle_snow2.png', boxSize, 0.02, 3, 0.2, 1);
        snow.on("ready", function (evt) {
            evt.target.object3D.position.y = boxSize / 2;
            snowObject.add(evt.target.object3D);
            scene.add(snowObject);
        });

        /*
            console.log("gravity = " + snow.getGravity());
            console.log("wind  = " + snow.getWindSpeed());
            timeout(() => {
                snow.setGravity(2);
                snow.setWindSpeed(1);
                console.log("gravity = " + snow.getGravity());
                console.log("wind  = " + snow.getWindSpeed());
            }, 3000);
        */

        /*
            timeout(() => {
                snow.setGravity(20);
                snow.setWindSpeed(10);
                console.log("gravity = " + snow.getGravity());
                console.log("wind  = " + snow.getWindSpeed());
            }, 8000);
        */

        var sloMoSno = new Interval(function () {
            snow.changeSpeed(0.05, 0.05);
            timeout(function () {
                snow.changeSpeed(1, 1);
            }, 3000);
        }, 8000, true);
    }

    function animate(timestamp) {
        var delta = Math.min(timestamp - lastRender, 500);
        lastRender = timestamp;
        controls.update();
        manager.render(scene, camera, timestamp);
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

        var material = skybox.material;
        scene.remove(skybox);

        var geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
        skybox = new THREE.Mesh(geometry, material);

        skybox.position.y = boxSize / 2;
        scene.add(skybox);
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
        }, function (_buildJsRodinjsUtilsMathJs) {}, function (_buildJsVendorThreeExamplesJsControlsVRControlsJs) {}, function (_buildJsVendorThreeExamplesJsEffectsVREffectJs) {}],
        execute: function () {

            WTF.is(RODIN);

            WTF.is('Rodin.JS v0.0.1');

            renderer = new THREE.WebGLRenderer({ antialias: true });

            renderer.setPixelRatio(window.devicePixelRatio);

            document.body.appendChild(renderer.domElement);

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 20);
            controls = new THREE.VRControls(camera);

            controls.standing = true;

            /*var controls = new RODIN.MobileCameraControls(
             scene,
             camera,
             new THREE.Vector3(0, 0, 0),
             new THREE.Vector3(0, 0, -0.01),
             renderer.domElement,
             true
             );
             //controls.standing = true;
             controls.userHeight = 1.6;
             controls.object.position.y = controls.userHeight;*/

            effect = new THREE.VREffect(renderer);

            effect.setSize(window.innerWidth, window.innerHeight);

            skybox = void 0;
            boxSize = 15;
            snowObject = new THREE.Object3D();
            loader = new THREE.TextureLoader();

            loader.load('img/box.png', onTextureLoaded);params = {
                hideButton: false, // Default: false.
                isUndistorted: false // Default: false.
            };
            manager = new WebVRManager(renderer, effect, params);
            light1 = new THREE.DirectionalLight(0xffffff);

            light1.position.set(1, 1, 1);
            scene.add(light1);

            light2 = new THREE.DirectionalLight(0x002288);

            light2.position.set(-1, -1, -1);
            scene.add(light2);

            amlight = new THREE.AmbientLight(0x222222);

            scene.add(amlight);

            requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);

            lastRender = 0;
            display = void 0;
        }
    };
});