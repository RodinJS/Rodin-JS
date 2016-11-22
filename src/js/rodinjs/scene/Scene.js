import {Sculpt} from "../sculpt/Sculpt.js";
import {THREE} from "../../vendor/three/THREE.GLOBAL.js";
import {Time} from "../time/Time.js";
import {Set} from '../utils/Set.js';
import {Objects} from '../objects.js';
import {Event} from '../Event.js';
import {TWEEN} from '../Tween.js';

import '../../vendor/three/examples/js/controls/VRControls.js';
import '../../vendor/three/examples/js/effects/VREffect.js';

const time = Time.getInstance();

export class Scene extends Sculpt {
    constructor (params = {}) {
        super();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.01, 100);
        this.renderer = new THREE.WebGLRenderer({
            antialias: window.devicePixelRatio < 2
        });
        this.scene.add(this.camera);

        this.controls = new THREE.VRControls(this.camera);
        this.controllers = new Set();
        this.effect = new THREE.VREffect(this.renderer);
        this.webVRmanager = new WebVRManager(this.renderer, this.effect, { hideButton: false, isUndistorted: false });

        this.preRenderFunctions = new Set();
        this.postRenderFunctions = new Set();

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.controls.standing = true;
        this.effect.setSize(window.innerWidth, window.innerHeight);

        this.time = Time.getInstance();

        window.addEventListener('resize', this.onResize.bind(this), true);
        window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this), true);
        requestAnimationFrame(this.render.bind(this));
    }

    onResize () {
        this.effect.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    // todo: tanel esi scenemanager
    get render () {
        return (timestamp) => {
            if(this.camera.projectionMatrixNeedsUpdate){
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

            requestAnimationFrame(this.render.bind(this));
        }
    }

    setCameraProperty(property, value){
        Object.setProperty(this.camera, property, value);
        this.camera.projectionMatrixNeedsUpdate = true;
    }

    preRender (fn) {
        this.preRenderFunctions.push(fn);
    }

    postRender (fn) {
        this.postRenderFunctions.push(fn);
    }

    add (obj) {
        this.scene.add(obj);
    }

    addController (controller) {
        controller.setRaycasterScene(this.scene);
        controller.setRaycasterCamera(this.camera);
    }

    enable () {
        document.body.appendChild(this.renderer.domElement);
    }
}