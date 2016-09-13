import {THREE} from '../../_build/js/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {WTF} from '../../_build/js/rodinjs/RODIN.js';
import State from '../../src/js/rodinjs/sockets/State.js';
import Interval from '../../src/js/rodinjs/utils/interval.js';

WTF.is(RODIN);

import '../../node_modules/three/examples/js/controls/VRControls.js';
import '../../node_modules/three/examples/js/effects/VREffect.js';

WTF.is('Rodin.JS v0.0.1');

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);

var controls = new THREE.VRControls(camera);
controls.standing = true;

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var distanceRatio = 1;

var boxSize = 15 * distanceRatio;
var loader = new THREE.TextureLoader();
loader.load('img/boxW.png', onTextureLoaded);

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

var params = {
    hideButton: false, // Default: false.
    isUndistorted: false // Default: false.
};
var manager = new WebVRManager(renderer, effect, params);

class CardboardObject extends RODIN.ObjectFromModel {
    constructor() {
        super(
            CardboardObject,
            {
                url: "./model/cardboard/cardboard.js"
            },
            [
                {
                    url: "./model/cardboard/cardboard_m.jpg"
                },
                {
                    color: 0xaaaaaa
                }
            ]
        );
    }
}

var light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(1, 1, 1);
scene.add(light1);

var light2 = new THREE.DirectionalLight(0x002288);
light2.position.set(-1, -1, -1);
scene.add(light2);

var amlight = new THREE.AmbientLight(0x222222);
scene.add(amlight);


var stateService = new State("room-id");
let subscribers = [];
let emitInterval;


stateService.on("userenter", function (data) {
    drawCardboardsFromSocketData(data);
    if (data.isSelf) {
        emitInterval = new Interval(emitStateFn, 100, true);
    }
});

stateService.on("userleave", function (data) {
    drawCardboardsFromSocketData(data);
});

stateService.on("userPositionChanged", function (data) {
    for (var i = 0; i < subscribers.length; i++) {
        if (subscribers[i].uid == data.actionUser) {

            subscribers[i].cardboard.setCardboardRotation(data.data.rotation);
            break;
        }
    }
});

function emitStateFn() {
    var tmpObject = new THREE.Object3D();
    tmpObject.applyMatrix(camera.matrixWorld);

    var emitData = {
        rotation: {
            x: tmpObject.rotation.x,
            y: tmpObject.rotation.y,
            z: tmpObject.rotation.z
        }
    };

    if (!angular.equals(emitData, stateHistory.emitData) || stateHistory.isChangeUserCount) {
        angular.merge(stateHistory.emitData, emitData);
        if (stateHistory.isChangeUserCount) {
            stateHistory.isChangeUserCount = false;
        }

        stateService.emit("userPositionChanged", emitData);
    }
}

function drawCardboardsFromSocketData(data) {
    var maxItems = data.room.subscribers.length;

    subscribers.map(function (user) {
        scene.remove(user.cardboard.object);
    });

    subscribers.splice(0, subscribers.length);

    for (let i = 0, ang = (4 * Math.PI) / maxItems; i < data.room.subscribers.length; i++, ang += (2 * Math.PI) / maxItems) {

        if ($scope.UserGeneralInfo.id === data.room.subscribers[i].uid) {
            var x = Math.round(Math.cos(ang) / 4);
            var z = Math.round(Math.sin(ang) / 4);

            cameraControls.object.position.set(x, 0, z);

            continue;
        }


        let cardboard = new CardboardObject();
        cardboard.on('ready', () => {
            let x = Math.round(Math.cos(ang) / 4);
            let z = Math.round(Math.sin(ang) / 4);

            subscribers.push({
                uid: data.room.subscribers[i].uid,
                user: data.room.subscribers[i].user,
                cardboard: cardboard
            });

            cardboard.object3D.position.x = x;
            cardboard.object3D.position.z = z;
            cardboard.object3D.scale.set(0.01, 0.01, 0.01);
            scene.add(cardboard.object3D);
        });
    }
}


let cardboard = new CardboardObject();
cardboard.on('ready', () => {
    cardboard.object3D.position.x = -3;
    cardboard.object3D.position.z = -5;
    cardboard.object3D.scale.set(0.01, 0.01, 0.01);
    scene.add(cardboard.object3D);
});

cardboard.on('update', () => {
    cardboard.object3D && (cardboard.object3D.rotation.y += 0.01);
});


requestAnimationFrame(animate);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

var lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    controls.update();
    manager.render(scene, camera, timestamp);
    RODIN.Objects.map(obj => obj.emit('update', new RODIN.Event(obj)));
    requestAnimationFrame(animate);
}

function onResize(e) {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

var display;

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