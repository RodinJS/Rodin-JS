'use strict';

System.register(['../../_build/js/vendor/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/Tween.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js', '../../_build/js/vendor/dat-gui/index.js'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, WTF, TWEEN, GUI, renderer, time, GUIparams, gui, scene, camera, controls, effect, params, manager, cube, directionalLight1, directionalLight2, ambientLight;


    function animate(timestamp) {
        updateGUI();
        controls.update();
        manager.render(scene, camera, timestamp);
        RODIN.Objects.map(function (obj) {
            return obj.emit('update', new RODIN.Event(obj));
        });
        TWEEN.update();
        requestAnimationFrame(animate);
        time.tick();
    }

    function onResize(e) {
        effect.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    function generateGUI() {
        var Params = function Params() {
            this.timeSpeed = 1;
            this.startTime = time.startTime;
            this.now = 0;
        };

        GUIparams = new Params();

        gui = new GUI.GUI();
        var events = 'click  mousedown';
        events.split(' ').map(function (e) {
            return gui.domElement.addEventListener(e, function (evt) {
                evt.stopPropagation();
            });
        });

        gui.add(GUIparams, 'timeSpeed', 0, 10).onChange(function (newValue) {
            time.speed = newValue;
        });

        gui.add(GUIparams, 'startTime', time.startTime);
        gui.add(GUIparams, 'now');
    }

    function updateGUI() {
        if (gui) {
            GUIparams.now = time.now();
            for (var i in gui.__controllers) {
                gui.__controllers[i].updateDisplay();
            }
        }
    }
    return {
        setters: [function (_buildJsVendorThreeTHREEGLOBALJs) {
            THREE = _buildJsVendorThreeTHREEGLOBALJs.THREE;
        }, function (_buildJsRodinjsRODINJs) {
            RODIN = _buildJsRodinjsRODINJs;
            WTF = _buildJsRodinjsRODINJs.WTF;
        }, function (_buildJsRodinjsTweenJs) {
            TWEEN = _buildJsRodinjsTweenJs.TWEEN;
        }, function (_buildJsVendorThreeExamplesJsControlsVRControlsJs) {}, function (_buildJsVendorThreeExamplesJsEffectsVREffectJs) {}, function (_buildJsVendorDatGuiIndexJs) {
            GUI = _buildJsVendorDatGuiIndexJs;
        }],
        execute: function () {

            WTF.is(RODIN);

            WTF.is('Rodin.JS v0.0.1');

            renderer = new THREE.WebGLRenderer({ antialias: true });

            renderer.setPixelRatio(window.devicePixelRatio);

            time = RODIN.Time.getInstance();
            GUIparams = null;
            gui = null;


            document.body.appendChild(renderer.domElement);

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
            controls = new THREE.VRControls(camera);

            controls.standing = true;

            effect = new THREE.VREffect(renderer);

            effect.setSize(window.innerWidth, window.innerHeight);

            params = {
                hideButton: false,
                isUndistorted: false
            };
            manager = new WebVRManager(renderer, effect, params);


            requestAnimationFrame(animate);
            generateGUI();

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);cube = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshPhongMaterial({ color: 0x336699 })));

            cube.on('ready', function (evt) {
                scene.add(evt.target.object3D);
                evt.target.object3D.position.set(0, controls.userHeight, -1);
            });

            cube.on('update', function (evt) {
                evt.target.object3D.rotation.y += time.deltaTime() / 1000;
                evt.target.object3D.rotation.z += time.deltaTime() / 2000;
            });

            directionalLight1 = new THREE.PointLight(0xffffff, 0.5);

            directionalLight1.position.set(-1, controls.userHeight * 2, -1);
            scene.add(directionalLight1);

            directionalLight2 = new THREE.PointLight(0xffffff, 0.5);

            directionalLight2.position.set(1, controls.userHeight * 2, -1);
            scene.add(directionalLight2);

            ambientLight = new THREE.AmbientLight(0xffffff);

            scene.add(ambientLight);
        }
    };
});