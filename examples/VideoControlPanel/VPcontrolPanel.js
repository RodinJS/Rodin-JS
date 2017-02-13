'use strict';

import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {RodinEvent} from '../../_build/js/rodinjs/RodinEvent.js';
import {Sculpt} from '../../_build/js/rodinjs/sculpt/Sculpt.js';
import {timeout} from '../../_build/js/rodinjs/utils/timeout.js';
import {Interval} from '../../_build/js/rodinjs/utils/interval.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {Element} from '../../_build/js/rodinjs/sculpt/elements/Element.js';
import {Text} from '../../_build/js/rodinjs/sculpt/elements/Text.js';
import {Animation} from '../../_build/js/rodinjs/animation/Animation.js';

let bufferAnimation = new Animation("bufferAnimation", {
    rotation: {
        x: 0,
        y: {
            from: -Math.PI/2,
            to: Math.PI/2,
        },
        z: 0
    }
});
bufferAnimation.loop(true);
bufferAnimation.duration(1000);

let hoverAnimation = new Animation("hoverAnimation", {
    scale: {
        x: 1.1,
        y: 1.1,
        z: 1.1
    }
});
hoverAnimation.duration(200);

let hoverOutAnimation = new Animation("hoverOutAnimation", {
    scale: {
        x: 1,
        y: 1,
        z: 1
    }
});
hoverOutAnimation.duration(200);

let scaleOutAnimation = new Animation("scaleOutAnimation", {
    scale: {
        x: 0.01,
        y: 0.01,
        z: 0.01
    }
});
scaleOutAnimation.duration(150);

let scaleInAnimation = new Animation("scaleInAnimation", {
    scale: {
        x: {from: 0.01, to: 1},
        y: {from: 0.01, to: 1},
        z: {from: 0.01, to: 1}
    }
});
scaleInAnimation.duration(150);

export class VPcontrolPanel extends Sculpt {

    constructor({ player, title = "Untitled Video", distance = 1, width = 1.5, controllers }) {

        super(0);
        this.object = new THREE.Object3D();
        this.panel = new THREE.Object3D();
        this.player = player;
        this.width = width;
        this.elementsPending = 0;
        this.timeBarButton = null;
        this.title = title;
        this.controllers = controllers;
        this.createTitle();
        this.createPlayPauseButtons();
        this.createTimeLine();
        this.createTimeBar();
        this.createAudioToggle();
        this.createHDToggle();
        this.createBackGround(distance, width);
        this.panel.position.z = -distance;
        this.scene = SceneManager.get();
        let target = new THREE.Object3D();
        target.position.z = -1;
        let camera = this.scene.camera;
        camera.add(target);

        this.object.add(this.panel);

        this.createBufferingLogo(distance);

        this.hideControls = (now) => {
            secsToFade -= now ? secsToFade: 1;
            if(secsToFade == 0){
                this.object.visible = false;
            }
        };

        let doShow = true;
        let secsToFade = 3;

        this.fadeTimeOut = setInterval(this.hideControls, 1000);


        for(let ci = 0; ci < this.controllers.length; ci++){

            let controller = this.controllers[ci];

            controller.onKeyDown = (keyCode) => {
                doShow = true;
                this.showTimeOut =  setTimeout(() => {
                    doShow = false;
                }, 200);
                if(this.object.visible && (!controller.intersected || controller.intersected.length == 0)){
                    this.object.visible = false;
                    doShow = false;
                    this.hideControls(true);

                }
            };

            controller.onKeyUp = (keyCode) => {
                if(doShow){
                    this.scene.scene.updateMatrixWorld();
                    let vector = new THREE.Vector3();
                    vector.setFromMatrixPosition(target.matrixWorld);
                    if (vector.x != 0 || vector.z != 0) {
                        let newRot = Math.atan(vector.x / vector.z) + (vector.z < 0 ? Math.PI : 0) + Math.PI;
                        if(!this.object.visible || Math.abs(this.object.rotation.y - newRot) >= Math.PI/3){
                            this.object.rotation.y = newRot;
                        }

                    }
                    this.object.visible = true;
                    secsToFade = 3;
                }
            };


            controller.gamepadHover = (intersect) => {
                secsToFade = 3;
            };

            controller.gamepadHoverOut = (intersect) => {
                secsToFade = 3;
            };
        }



        this.player.onBufferStart = () => {
            this.scene.camera.add(this.bufferEl.object3D);
        };
        this.player.onBufferEnd = () => {
            this.scene.camera.remove(this.bufferEl.object3D);
        };
    }

    readyCheck() {
        if (!this.elementsPending) {
            super.init(this.object);
            timeout(() => {
                this.emit("ready", new RodinEvent(this));
            }, 0);
        }
    }

    createBackGround(distance, width) {
        let r = Math.sqrt(distance * distance + width * width / 4) * 2;

        let sphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(r, 12, 12),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.3,
                //wireframe:true,
                side: THREE.BackSide
            })
        );
        sphere.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( 0, 0, -distance));
        sphere.position.z = distance;
        this.object.add(sphere);
    }


    createTitle() {
        let titleParams = {
            text: this.title,
            color: 0xffffff,
            fontFamily: "Arial",
            fontSize: this.width * 0.04,
            ppm: 1000
        };
        let titleButton = new Text(titleParams);
        this.elementsPending++;

        titleButton.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = this.width / 4;
            this.panel.add(object);
            this.elementsPending--;
            this.readyCheck();
        });


    }






    createBufferingLogo(distance) {
        let bufferingParams = {name: "buffering", width: this.width / 6, height: this.width / 6};

        bufferingParams.background = {
            color: 0x666666,
            opacity: 0.3
        };

        bufferingParams.border = {
            radius: this.width / 12,
            width: this.width / 500,
            color: 0xffffff
        };

        bufferingParams.image = {
            url: "./img/rodin.png",
            width: this.width / 30,
            height: this.width / 25,
            position: {h: 54, v: 35}
        };
        bufferingParams.label = {
            text: "loading",
                fontSize: this.width / 37.5,
                color: 0xffffff,
                position: {
                h: 50,
                v: 65
            }
        };

        this.bufferEl = new Element(bufferingParams);
        this.elementsPending++;

        this.bufferEl.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.z = -distance + bufferingParams.width/2;
            evt.target.animator.add(bufferAnimation);
            evt.target.animator.start("bufferAnimation");
            this.elementsPending--;
            this.readyCheck();
        });
    }





    createPlayPauseButtons() {
        let playParams = {name: "play", width: this.width / 5, height: this.width / 5};

        playParams.background = {
            color: 0x666666,
            opacity: 0.3
        };

        playParams.border = {
            radius: this.width / 10
        };

        playParams.image = {
            url: "./img/play.png",
            width: this.width / 15,
            height: this.width / 15,
            position: {h: 54, v: 50}
        };

        let playButton = new Element(playParams);
        this.elementsPending++;

        playButton.on('ready', (evt) => {
            let object = evt.target.object3D;
            this.panel.add(object);
            RODIN.Raycastables.push(object);
            evt.target.animator.add(hoverAnimation, hoverOutAnimation, scaleOutAnimation, scaleInAnimation);
            this.elementsPending--;
            this.readyCheck();
        });

        playButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            !evt.target.animator.isPlaying("scaleOutAnimation") && evt.target.animator.start("hoverAnimation");
        });

        playButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            !evt.target.animator.isPlaying("scaleOutAnimation") && evt.target.animator.start("hoverOutAnimation");
        });

        playButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            if(this.object.visible){
                evt.target.animator.start("scaleOutAnimation");
            }
        });

        playButton.on(RODIN.CONSTANTS.EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {
            if (evt.animation === "scaleOutAnimation") {
                this.panel.remove(evt.target.object3D);
                this.panel.add(pauseButton.object3D);
                pauseButton.animator.start("scaleInAnimation");
                this.player.play();
                this.hideControls(true);
            }
        });


        let pauseParams = {name: "pause", width: this.width / 5, height: this.width / 5};

        pauseParams.background = {
            color: 0x666666,
            opacity: 0.3
        };

        pauseParams.border = {
            radius: this.width / 10
        };

        pauseParams.image = {
            url: "./img/pause.png",
            width: this.width * 0.04,
            height: this.width * 0.06,
            position: {h: 50, v: 50}
        };

        let pauseButton = new Element(pauseParams);
        this.elementsPending++;

        pauseButton.on('ready', (evt) => {
            let object = evt.target.object3D;
            RODIN.Raycastables.push(object);
            evt.target.animator.add(hoverAnimation, hoverOutAnimation, scaleOutAnimation, scaleInAnimation);
            this.elementsPending--;
            this.readyCheck();
        });

        pauseButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            !evt.target.animator.isPlaying("scaleOutAnimation") && evt.target.animator.start("hoverAnimation");
        });

        pauseButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            !evt.target.animator.isPlaying("scaleOutAnimation") && evt.target.animator.start("hoverOutAnimation");
        });

        pauseButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            if(this.object.visible){
                evt.target.animator.start("scaleOutAnimation");
            }
        });

        pauseButton.on(RODIN.CONSTANTS.EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {
            if (evt.animation === "scaleOutAnimation") {
                this.panel.remove(evt.target.object3D);
                this.panel.add(playButton.object3D);
                playButton.animator.start("scaleInAnimation");
                this.player.pause();
            }
        });
    }

    createTimeLine() {
        let color = 0xff9a2b;

        let timeLineBGParams = {
            name: "timeLineBG",
            width: this.width,
            height: this.width / 50,
            background: {
                color: 0xaaaaaa,
                opacity: 0.5
            }
        };

        let timeLineParams = {
            name: "timeLine",
            width: this.width,
            height: this.width / 50,
            background: {
                color: color
            },
            transparent: false
        };

        let caretParams = {
            name: "caret",
            width: this.width * 0.024,
            height: this.width * 0.024,
            border: {
                radius: this.width * 0.012
            },
            background: {
                color: 0xffffff
            },
            transparent: false
        };

        let pointerParams = {
            name: "pointer",
            width: this.width * 0.046,
            height: this.width * 0.046,
            border: {
                width: this.width / 500,
                color: 0xffffff,
                radius: this.width * 0.023
            },
            label: {
                text: "I",
                fontSize: this.width / 37.5,
                color: 0xff0000,
                position: {
                    h: 50,
                    v: 55
                }
            }
        };


        let pointerTimeParams = {
            name: "pointerTimeParams",
            text: "0:00",
            color: 0xffffff,
            fontFamily: "Arial",
            fontSize: this.width / 37.5,
            ppm: 1000
        }


        let timeLineBG = new Element(timeLineBGParams);
        this.elementsPending++;

        timeLineBG.on('ready', (evt) => {
            evt.target.forceHover = true;
            let object = evt.target.object3D;
            object.position.y = -this.width / 3.75;
            this.panel.add(object);
            this.elementsPending--;
            RODIN.Raycastables.push(object);
            this.readyCheck();
        });

        timeLineBG.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            if (pointer.object3D) {
                pointer.object3D.visible = true;
                pointer.object3D.position.x = evt.uv.x - this.width / 2;
            }
            if (pointerTime.object3D) {
                let time = Math.secondsToH_MM_SS(this.player.getLength() * evt.uv.x / this.width);
                pointerTime.object3D.position.x = evt.uv.x - this.width / 2;
                if (time === pointerTime.lastTime && pointerTime.object3D.visible) return;
                pointerTimeParams.text = time;
                pointerTime.reDraw(pointerTimeParams);
                pointerTime.object3D.visible = true;
                pointerTime.lastTime = time;
            }
        });

        timeLineBG.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            if (pointer.object3D) {
                pointer.object3D.visible = false;
            }
            if (pointerTime.object3D) {
                pointerTime.object3D.visible = false;
            }
        });

        timeLineBG.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            this.player.jumpTo(evt.uv.x / this.width);
        });

        let timeLine = new Element(timeLineParams);
        this.elementsPending++;

        timeLine.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = -this.width / 3.75;
            object.position.z = 0.0001;
            object.scale.set(0.0001, 1, 1);
            this.panel.add(object);
            this.elementsPending--;
            this.readyCheck();
        });


        timeLine.on("update", (evt) => {
            let time = this.player.getTime();
            time = time ? time : 0.0001;
            let duration = this.player.getLength();
            if (!duration) return;
            let scale = time / duration;
            let object = evt.target.object3D;
            object.scale.set(scale, 1, 1);
            object.position.x = (scale - 1) * this.width / 2;
        });


        let caret = new Element(caretParams);
        this.elementsPending++;

        caret.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = -this.width / 3.75;
            object.position.z = 0.0002;
            object.position.x = -this.width / 2;
            this.panel.add(object);
            this.elementsPending--;
            this.readyCheck();
        });

        caret.on('update', (evt) => {
            if (timeLine.object3D) {
                let object = evt.target.object3D;
                object.position.x = timeLine.object3D.scale.x * this.width - this.width / 2;
            }
        });


        let pointer = new Element(pointerParams);
        this.elementsPending++;

        pointer.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = -this.width / 3.75;
            object.position.z = 0.0004;
            object.material.depthWrite = false;
            object.position.x = -this.width / 2;
            object.visible = false;
            this.panel.add(object);
            this.elementsPending--;
            this.readyCheck();
        });

        let pointerTime = new Text(pointerTimeParams);
        this.elementsPending++;

        pointerTime.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = -this.width * 0.21;
            object.position.z = 0.0004;
            object.position.x = 0;
            object.visible = false;
            this.panel.add(object);
            this.elementsPending--;
            this.readyCheck();
        });


    }

    createTimeBar() {
        let timeBarParams = {
            text: "0:00/0:00",
            color: 0xffffff,
            fontFamily: "Arial",
            fontSize: this.width / 30,
            ppm: 1000
        };
        this.timeBarButton = new Text(timeBarParams);
        this.elementsPending++;
        this.timeBarButton.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = -this.width / 3;
            object.position.x = -this.width / 2;

            this.panel.add(object);
            this.elementsPending--;
            this.readyCheck();
        });
        this.timeBarButton.on('update', (evt) => {
            let time = Math.secondsToH_MM_SS(this.player.getTime());
            let total = Math.secondsToH_MM_SS(this.player.getLength());
            if (time === evt.target.lastTime) return;
            timeBarParams.text = time + "/" + total;
            evt.target.reDraw(timeBarParams);

            if (!isNaN(this.player.getLength())) {
                evt.target.lastTime = time;
            }

            evt.target.object3D.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(evt.target.object3D.geometry.parameters.width / 2, 0, 0));
        });
    }

    createAudioToggle() {
        let muteParams = {name: "mute", width: this.width * 0.04, height: this.width * 0.04, ppm: 1000};

        muteParams.image = {
            url: "./img/audioON.png",
            width: this.width * 0.04,
            height: this.width * 0.04,
            position: {h: 50, v: 50}
        };

        let muteButton = new Element(muteParams);
        this.elementsPending++;

        muteButton.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = -this.width / 3.02;
            object.position.x = -this.width / 2;
            this.panel.add(object);
            RODIN.Raycastables.push(object);
            evt.target.animator.add(hoverAnimation, hoverOutAnimation);
            this.elementsPending--;
            this.readyCheck();
        });
        muteButton.on('update', (evt) => {
            if (this.timeBarButton) {
                let object = evt.target.object3D;
                object.position.x = this.timeBarButton.object3D.position.x + this.timeBarButton.object3D.scale.x * this.timeBarButton.object3D.geometry.parameters.width + this.width / 30;
            }
        });

        muteButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            evt.target.animator.start("hoverAnimation");
        });

        muteButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            evt.target.animator.start("hoverOutAnimation");
        });

        muteButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            this.player.mute(true);
            let object = evt.target.object3D;
            this.panel.remove(object);
            this.panel.add(unmuteButton.object3D);
        });

        let unmuteParams = {name: "unmute", width: this.width * 0.04, height: this.width * 0.04, ppm: 1000};

        unmuteParams.image = {
            url: "./img/audioOFF.png",
            width: this.width * 0.04,
            height: this.width * 0.04,
            opacity: 0.6,
            position: {h: 50, v: 50}
        };

        let unmuteButton = new Element(unmuteParams);
        this.elementsPending++;

        unmuteButton.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = -this.width / 3.02;
            object.position.x = -this.width / 2;
            RODIN.Raycastables.push(object);
            evt.target.animator.add(hoverAnimation, hoverOutAnimation);
            this.elementsPending--;
            this.readyCheck();
        });
        unmuteButton.on('update', (evt) => {
            if (this.timeBarButton) {
                let object = evt.target.object3D;
                object.position.x = this.timeBarButton.object3D.position.x + this.timeBarButton.object3D.scale.x * this.timeBarButton.object3D.geometry.parameters.width + this.width / 30;
            }
        });

        unmuteButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            evt.target.animator.start("hoverAnimation");
        });

        unmuteButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            evt.target.animator.start("hoverOutAnimation");
        });

        unmuteButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            this.player.mute(false);
            let object = evt.target.object3D;
            this.panel.remove(object);
            this.panel.add(muteButton.object3D);
        });

    }

    createHDToggle() {
        let HDParams = {
            text: "HD",
            color: 0xffffff,
            fontFamily: "Arial",
            fontSize: this.width / 30,
            ppm: 1000
        };
        let HDButton = new Text(HDParams);

        this.elementsPending++;

        HDButton.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = -this.width / 3.02;
            object.position.x = this.width * 0.48;
            this.panel.add(object);
            RODIN.Raycastables.push(object);
            evt.target.animator.add(hoverAnimation, hoverOutAnimation);
            this.elementsPending--;
            this.readyCheck();
        });

        HDButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            evt.target.animator.start("hoverAnimation");
        });

        HDButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            evt.target.animator.start("hoverOutAnimation");
        });

        HDButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {

            let playAfter = this.player.isPlaying();
            this.player.switchTo("SD");

            let object = evt.target.object3D;
            this.panel.remove(object);
            this.panel.add(SDButton.object3D);

            if (playAfter) {
                this.player.play();
            }
        });


        let SDParams = {
            text: "SD",
            color: 0xffffff,
            fontFamily: "Arial",
            fontSize: this.width / 30,
            ppm: 1000
        };
        let SDButton = new Text(SDParams);

        this.elementsPending++;

        SDButton.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = -this.width / 3.02;
            object.position.x = this.width * 0.48;
            RODIN.Raycastables.push(object);
            evt.target.animator.add(hoverAnimation, hoverOutAnimation);
            this.elementsPending--;
            this.readyCheck();
        });

        SDButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            evt.target.animator.start("hoverAnimation");
        });

        SDButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            evt.target.animator.start("hoverOutAnimation");
        });

        SDButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {

            let playAfter = this.player.isPlaying();
            this.player.switchTo("HD");

            let object = evt.target.object3D;
            this.panel.remove(object);
            this.panel.add(HDButton.object3D);

            if (playAfter) {
                this.player.play();
            }
        });


        let LDParams = {
            text: "LD",
            color: 0xffffff,
            fontFamily: "Arial",
            fontSize: this.width / 30,
            ppm: 1000
        };
        let LDButton = new Text(LDParams);

        this.elementsPending++;

        LDButton.on('ready', (evt) => {
            let object = evt.target.object3D;
            object.position.y = -this.width / 3.02;
            object.position.x = this.width * 0.48;
            RODIN.Raycastables.push(object);
            evt.target.animator.add(hoverAnimation, hoverOutAnimation);
            this.elementsPending--;
            this.readyCheck();
        });

        LDButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            evt.target.animator.start("hoverAnimation");
        });

        LDButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
            evt.target.animator.start("hoverOutAnimation");
        });

        LDButton.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {

            let playAfter = this.player.isPlaying();
            this.player.switchTo("HD");

            let object = evt.target.object3D;
            this.panel.remove(object);
            this.panel.add(HDButton.object3D);

            if (playAfter) {
                this.player.play();
            }
        });

    }
}