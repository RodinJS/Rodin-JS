'use strict';

System.register(['../../_build/js/vendor/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../_build/js/rodinjs/Tween.js', '../../_build/js/vendor/three/examples/js/controls/VRControls.js', '../../_build/js/vendor/three/examples/js/effects/VREffect.js', '../../_build/js/vendor/dat-gui/index.js'], function (_export, _context) {
    "use strict";

    var THREE, RODIN, WTF, TWEEN, GUI, renderer, scene, camera, controls, effect, distanceRatio, boxSize, loader, params, manager, CardboardObject, light1, light2, amlight, cardboard, lastRender, display;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    function onTextureLoaded(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(boxSize, boxSize);

        var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });

        var skybox = new THREE.Mesh(geometry, material);

        scene.add(skybox);
        skybox.position.y = boxSize / 2 - controls.userHeight;
        setupStage();
    }

    function animate(timestamp) {
        var delta = Math.min(timestamp - lastRender, 500);
        lastRender = timestamp;

        controls.update();
        manager.render(scene, camera, timestamp);
        RODIN.Objects.map(function (obj) {
            return obj.emit('update', new RODIN.Event(obj), delta);
        });
        TWEEN.update();
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

    function generateGUI() {

        var FizzyText = function FizzyText() {
            this.x = -3;
            this.y = 0;
            this.z = -5;
            this.duration = 3000;
            this.start = function () {
                cardboard && cardboard.object3D && cardboard.animate({
                    duration: this.duration,
                    to: new THREE.Vector3(this.x, this.y, this.z),
                    property: RODIN.CONSTANTS.ANIMATION_TYPES.ROTATION
                });
            };
        };

        var text = new FizzyText();

        var gui = new GUI.GUI();
        var events = 'click  mousedown';
        events.split(' ').map(function (e) {
            return gui.domElement.addEventListener(e, function (evt) {
                evt.stopPropagation();
            });
        });

        gui.add(text, 'x', -Math.PI, Math.PI);
        gui.add(text, 'y', -Math.PI, Math.PI);
        gui.add(text, 'z', -Math.PI, Math.PI);
        gui.add(text, 'duration', 1, 20000);
        gui.add(text, 'start');
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

            document.body.appendChild(renderer.domElement);

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
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

            CardboardObject = function (_RODIN$JSONModelObjec) {
                _inherits(CardboardObject, _RODIN$JSONModelObjec);

                function CardboardObject(id) {
                    _classCallCheck(this, CardboardObject);

                    return _possibleConstructorReturn(this, (CardboardObject.__proto__ || Object.getPrototypeOf(CardboardObject)).call(this, id, "./model/cardboard/cardboard.js"));
                }

                return CardboardObject;
            }(RODIN.JSONModelObject);

            light1 = new THREE.DirectionalLight(0xffffff);

            light1.position.set(1, 1, 1);
            scene.add(light1);

            light2 = new THREE.DirectionalLight(0xffffff);

            light2.position.set(-1, -1, -1);
            scene.add(light2);

            amlight = new THREE.AmbientLight(0x222222);

            scene.add(amlight);

            cardboard = new CardboardObject();

            cardboard.on('ready', function () {
                cardboard.object3D.position.x = -3;
                cardboard.object3D.position.z = -5;
                cardboard.object3D.scale.set(0.01, 0.01, 0.01);
                console.log(cardboard.object3D);
                //cardboard.object3D.material.materials[0] = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("./model/cardboard/cardboard_m.jpg"), color:0xffffff});
                scene.add(cardboard.object3D);
            });

            requestAnimationFrame(animate);
            generateGUI();

            window.addEventListener('resize', onResize, true);
            window.addEventListener('vrdisplaypresentchange', onResize, true);

            lastRender = 0;
        }
    };
});