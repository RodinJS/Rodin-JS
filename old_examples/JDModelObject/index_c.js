'use strict';

System.register(['../../_build/js/vendor/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/vendor/JDLoader.min.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, WTF, renderer, time, scene, camera, skybox, controls, effect, distanceRatio, boxSize, loader, params, manager, light1, light2, amlight, obj, display;


    function onTextureLoaded(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(boxSize, boxSize);

        var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });

        skybox = new THREE.Mesh(geometry, material);
        scene.add(skybox);
        skybox.position.y = boxSize / 2 - controls.userHeight;
        setupStage();
    }

    function animate(timestamp) {
        time.tick();
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
        }, function (_buildJsRodinjsVendorJDLoaderMinJs) {}, function (_buildJsVendorThreeExamplesJsControlsVRControlsJs) {}, function (_buildJsVendorThreeExamplesJsEffectsVREffectJs) {}],
        execute: function () {

            WTF.is(RODIN);

            WTF.is('Rodin.JS v0.0.1');

            renderer = new THREE.WebGLRenderer({ antialias: true });

            renderer.setPixelRatio(window.devicePixelRatio);

            time = RODIN.Time.getInstance();

            document.body.appendChild(renderer.domElement);

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
            skybox = void 0;
            controls = new THREE.VRControls(camera);

            controls.standing = true;

            effect = new THREE.VREffect(renderer);

            effect.setSize(window.innerWidth, window.innerHeight);

            distanceRatio = 1;
            boxSize = 15 * distanceRatio;
            loader = new THREE.TextureLoader();

            loader.load('img/boxW.png', onTextureLoaded);params = {
                hideButton: false, // Default: false.
                isUndistorted: false // Default: false.
            };
            manager = new WebVRManager(renderer, effect, params);
            light1 = new THREE.DirectionalLight(0xffffff);

            light1.position.set(1, 1, 1);
            scene.add(light1);

            light2 = new THREE.DirectionalLight(0xcccccc);

            light2.position.set(-1, -1, -1);
            scene.add(light2);

            amlight = new THREE.AmbientLight(0x3e3e3e);

            scene.add(amlight);

            obj = new RODIN.JDModelObject(0, './model/man.jd');


            obj.on('ready', function () {
                var s = 0.009;
                obj.object3D.scale.set(s, s, s);
                obj.object3D.position.y = controls.userHeight - 1.6;
                obj.object3D.position.z = -1.6;
                obj.object3D.rotation.z = Math.PI / 2;
                obj.object3D.rotation.y = Math.PI / 2;
                scene.add(obj.object3D);
            });

            obj.on('update', function () {
                obj.object3D && (obj.object3D.rotation.y += time.deltaTime() / 2000);
            });

            requestAnimationFrame(animate);

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);display = void 0;
        }
    };
});