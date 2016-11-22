import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';
import * as GUI from '../../_build/js/vendor/dat-gui/index.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';

let scene = SceneManager.get();

scene.add(new THREE.AmbientLight());
let dl = new THREE.DirectionalLight();
dl.position.set(1, 1, 1);
scene.add(dl);

let downAnim = new Animation('down', {
    position: {
        y: 1,
        x: {
            from: -0.2,
            to: 0.2
        }
    },
    material: {
        color: {
            r: 1,
            g: 0,
            b: {
                from: 0,
                to: 1
            }
        }
    }
});
downAnim.duration(3000);

let upAnim = new Animation('up', {
    position: {
        y: scene.controls.userHeight
    }
});
upAnim.easing(TWEEN.Easing.Elastic.Out);


let upAnimRelative = new Animation('upRelative', {
    position: {
        y: '+0.2'
    }
});
upAnimRelative.easing(TWEEN.Easing.Elastic.InOut);

let cube = new RODIN.THREEObject(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshLambertMaterial({ color: 0x336699 })));
cube.on('ready', (evt) => {
    evt.target.object3D.position.set(0, scene.controls.userHeight, -0.5);
    scene.add(evt.target.object3D);
    RODIN.Raycastables.push(evt.target.object3D);

    evt.target.animator.add(downAnim, upAnim, upAnimRelative);
});

cube.on('update', (evt) => {
    if (!evt.target.animator.isPlaying()) {
        evt.target.object3D.rotation.y += RODIN.Time.deltaTime() / 500;
        evt.target.object3D.rotation.x += RODIN.Time.deltaTime() / 1000;
    }
});

cube.on(['animationstart', 'animationcomplete', 'animationend'], console.log);

generateGUI();

function generateGUI () {
    let FizzyText = function () {
        this.startDown = function () {
            cube.animator.getClip('down').loop(false).start();
        };
        this.startDownWithLoop = function () {
            cube.animator.getClip('down').loop(true).start();
        };
        this.stopDown = function () {
            cube.animator.getClip('down').stop();
        };
        this.startUp = function () {
            cube.animator.start('up');
        };
        this.stopUp = function () {
            cube.animator.stop('up');
        };
        this.startUpRelative = function () {
            cube.animator.start('upRelative')
        };
    };

    let text = new FizzyText();

    let gui = new GUI.GUI();
    let events = 'click  mousedown';
    events.split(' ').map(e =>
        gui.domElement.addEventListener(e, (evt) => {
            evt.stopPropagation();
        })
    );

    gui.add(text, 'startDown');
    gui.add(text, 'startDownWithLoop');
    gui.add(text, 'stopDown');
    gui.add(text, 'startUp');
    gui.add(text, 'stopUp');
    gui.add(text, 'startUpRelative');
}
