import {Sculpt} from "../sculpt/Sculpt.js";
import {THREE} from "../../vendor/three/THREE.GLOBAL.js";
import {Time} from "../time/Time.js";
import {timeout} from '../utils/timeout.js';
import {Set} from '../utils/Set.js';
import {Objects} from '../objects.js';
import {Event} from '../Event.js';
import {TWEEN} from '../Tween.js';

import '../../vendor/three/examples/js/controls/VRControls.js';
import '../../vendor/three/examples/js/effects/VREffect.js';

const time = Time.getInstance();
/**
 * Class Scene
 * <p>3D Scene (Three.js THREE.Scene) wrapper class, used in Rodin lib.</p>
 */
export class Scene extends Sculpt {
    constructor(params = {}) {
        super();
        /**
         * The main scene object.
         * @type {THREE.Scene}
         */
        this.scene = new THREE.Scene();

        /**
         * Trigger to stop or enable rendering.
         * @type {Boolean}
         */
        this._render = true;

        /**
         * The camera of the scene.
         * @type {THREE.PerspectiveCamera}
         */
        this.camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.01, 100);

        /**
         * The renderer of the scene.
         * @type {THREE.WebGLRenderer}
         */
        this.renderer = new THREE.WebGLRenderer({
            antialias: window.devicePixelRatio < 2
        });
        this.scene.add(this.camera);
        /**
         * The VR controls of the scene.
         * @type {THREE.VRControls}
         */
        this.controls = new THREE.VRControls(this.camera);
        /**
         * The controllers set used in the scene.
         * @type {Set<GamePad>}
         */
        this.controllers = new Set();

        /**
         * The VREffect effect used in the scene.
         * @type {THREE.VREffect}
         */
        this.effect = new THREE.VREffect(this.renderer);

        WebVRConfig.TOUCH_PANNER_DISABLED = false;

        /**
         * The webVRmanager (WebVR Boilerplate by Boris Smus)
         * @type {WebVRManager}
         */
        this.webVRmanager = new WebVRManager(this.renderer, this.effect, {hideButton: false, isUndistorted: false});

        /**
         * A set of functions to be called BEFORE main rendering action on each animation frame.
         * @type {Set<function>}
         */
        this.preRenderFunctions = new Set();
        /**
         * A set of functions to be called AFTER main rendering action on each animation frame.
         * @type {Set<function>}
         */
        this.postRenderFunctions = new Set();

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.controls.standing = true;
        this.effect.setSize(window.innerWidth, window.innerHeight);


        /**
         * The time object for scene time-related actions.
         * @type {Time}
         */
        this.time = Time.getInstance();

        window.addEventListener('resize', this.onResize.bind(this), true);
        window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this), true);
        this.render();

        timeout(() => {
            this.emit("ready", new Event(this));
        }, 0);
    }

    /**
     * Called on each window resize event.
     * <p>Resets the required rendering parameters for the new window size.</p>
     */
    onResize() {
        this.effect.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    start() {
        this._render = true;
    }

    stop() {
        this._render = false;
    }

    // TODO: tanel esi scenemanager
    get render() {
        return (timestamp) => {
            if (this._render) {

                if (this.camera.projectionMatrixNeedsUpdate) {
                    this.camera.updateProjectionMatrix();
                    this.camera.projectionMatrixNeedsUpdate = false;
                }
                time.tick();
                TWEEN.update();

                // Update VR headset position and apply to camera.
                this.controls.update();

                // Render the scene through the webVRmanager.
                Objects.map(i => i.emit('update', new Event(i)));
                this.preRenderFunctions.map(i => i());
                this.webVRmanager.render(this.scene, this.camera, timestamp);
                this.postRenderFunctions.map(i => i());


                // Update controllers
                this.controllers.map(controller => controller.update());

            }
            // check! if HMD is connected and active,
            // rendering is passed to HMD's animation frame loop, instead of the browser window's.
            if (this.webVRmanager.hmd && this.webVRmanager.hmd.isPresenting) {
                this.webVRmanager.hmd.requestAnimationFrame(this.render.bind(this));
            } else {
                requestAnimationFrame(this.render.bind(this));
            }

        }
    }

    /**
     * Set camera property
     * @param {string} property
     * @param {*} value
     */
    setCameraProperty(property, value) {
        Object.setProperty(this.camera, property, value);
        this.camera.projectionMatrixNeedsUpdate = true;
    }

    /**
     * Add function to pre render Set
     * @param {function} fn
     */
    preRender(fn) {
        this.preRenderFunctions.push(fn);
    }

    /**
     * Add function to post render Set
     * @param {function} fn
     */
    postRender(fn) {
        this.postRenderFunctions.push(fn);
    }

    /**
     * Add object to the scene
     * @param {Object3D} obj
     */
    add(obj) {
        this.scene.add(obj);
    }

    /**
     * Add controller to thee scene
     * @param {GamePad} controller
     */
    addController(controller) {
        controller.setRaycasterScene(this.scene);
        controller.setRaycasterCamera(this.camera);
    }

    /**
     * Enable scene:
     * <p>Adds the scene domElement to the document body.</p>
     */
    enable() {
        document.body.appendChild(this.renderer.domElement);
    }
}