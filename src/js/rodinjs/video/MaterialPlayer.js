import {THREE} from '../../three/THREE.GLOBAL.js';

export class MaterialPlayer {
    constructor(url, stereoscopic = false, format = "mp4", fps = 25) {
        let bufferCounter = 0;
        let lastTime = 0;
        this.framesToLoader = 30;
        this.isBuffering = false;
        let video = document.createElement('video');
        let sourceMP4 = document.createElement("source");
        let currDelta = 0;
        let frameDuration = 1000/fps;
        sourceMP4.type = "video/" + format;
        sourceMP4.src = url;
        video.appendChild(sourceMP4);
        video.width = 512;
        video.height = 256;
        video.autoplay = false;
        video.loop = true;
        video.preload = "auto";
        video.setAttribute('crossOrigin', 'Anonymous');
        video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        video.load();
        let textureL = new THREE.Texture(video);
        textureL.minFilter = textureL.magFilter = THREE.LinearFilter;
        textureL.format = THREE.RGBFormat;
        textureL.generateMipmaps = false;

        let textureR = null;

        if (stereoscopic) {
            //textureL.wrapS = textureL.wrapT = THREE.RepeatWrapping;
            textureL.repeat.set(1, 0.5);
            textureL.offset.set(0, 0.5);

            textureR = new THREE.Texture(video);
            textureR.minFilter = textureR.magFilter = THREE.LinearFilter;
            textureR.format = THREE.RGBFormat;
            textureR.generateMipmaps = false;
            //textureR.wrapS = textureR.wrapT = THREE.RepeatWrapping;
            textureR.repeat.set(1, 0.5);
        }

        this.onBufferStart = function () {
            console.log("buffering");
        };

        this.onBufferEnd = function () {
        /*
            let i = this.buffer.length;
            while (i--) {
                let x1 = this.buffer.start(i);
                let x2 = this.buffer.end(i);
                console.log(x1, x2);
            }
        */
            console.log("playing");
        };
        this.isPlaying = function () {
            return !video.paused;
        };

        this.getTextureL = () => {
            return textureL;
        };

        this.getTextureR = () => {
            return textureR;
        };

        this.isMute = () => {
            return video.muted;
        };

        this.play = () => {
            video.play();
        };

        this.pause = () => {
            video.pause();
        };

        this.playPause = () => {
            if (this.isPlaying()) {
                this.pause();
            } else {
                this.play();
            }
        };

        this.jumpTo = (percent) => {
            video.currentTime = video.duration * percent;
        };

        this.update = (delta) => {
            currDelta += delta;
            if(currDelta < frameDuration){
                return;
            }
            //console.log(currDelta);
            currDelta -= frameDuration;
            this.buffer = video.buffered;
            if (video.readyState !== video.HAVE_ENOUGH_DATA) {
                //this.pause();
                return;
            } else {
                if (this.isPlaying()) {
                    this.play();
                }
            }

            if(bufferCounter == 0 && !this.isBuffering && this.isPlaying()){
                this.isBuffering = true;
                this.onBufferStart();
            }else if(bufferCounter >= 3 && this.isBuffering){
                this.isBuffering = false;
                this.onBufferEnd();
            }

            if (lastTime == video.currentTime) {
                bufferCounter -= bufferCounter > 0 ? 1 : 0;
                return;
            }

            bufferCounter += bufferCounter < this.framesToLoader ? 1 : 0;
            lastTime = video.currentTime;
            textureL.needsUpdate = true;
            if (stereoscopic) {
                textureR.needsUpdate = true;
            }
        };

        this.destroy = () => {
            video.pause();
        };
    }
}
;