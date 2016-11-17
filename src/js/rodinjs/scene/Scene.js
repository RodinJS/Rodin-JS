import {Sculpt} from "../sculpt/Sculpt.js";
import {THREE} from "../../vendor/three/THREE.GLOBAL.js";
import {Time} from "../time/Time.js";
import {Set} from '../utils/Set.js';
import {Objects} from '../objects.js';
import {Event} from '../Event.js';


export class Scene extends Sculpt {
    constructor({
        /// Scene
        scene = new THREE.Scene(),
        /// Camera
        camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 100),
        /// Renderer
        renderer = new THREE.WebGLRenderer({
            antialias: window.devicePixelRatio < 2
        }),
        pixelRatio,
        /// Controls
        controls = new THREE.VRControls(camera),
        controlsStanding = true,
        /// Effect
        effect = new THREE.VREffect(renderer),
        webVRmanager = new WebVRManager(renderer, effect, {hideButton: false, isUndistorted: false})
    }) {
        super();

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
        this.effect = effect;
        this.time = Time.getInstance();
        this.webVRmanager = webVRmanager;

        this.preRenderFunctions = new Set();
        this.postRenderFunctions = new Set();

        /// Setup
        if (pixelRatio) {
            this.renderer.setPixelRatio(pixelRatio);
        }

        controls.standing = controlsStanding;

        this.effect.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', this.onResize.bind(this), true);
        window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this), true);
    }

    onResize(e) {
        this.effect.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    get render() {
        return () => {
            this.time.tick();

            // Update VR headset position and apply to camera.
            this.controls.update();

            // Render the scene through the webVRmanager.
            Objects.map( i => i.emit('update', new Event(i)));
            this.preRenderFunctions.map(i => i());
            this.webVRmanager.render(this.scene, this.camera, this.time.deltaTime());
            this.postRenderFunctions.map(i => i());

            requestAnimationFrame(this.render);
        }
    }

    preRender(fn) {
        this.preRenderFunctions.push(fn);
    }

    postRender(fn) {
        this.postRenderFunctions.push(fn);
    }
}