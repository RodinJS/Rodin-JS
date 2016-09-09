'use strict';

import {THREE} from '../../three/THREE.GLOBAL.js';
import {Event} from '../Event.js';
import {Sculpt} from './Sculpt.js';
import {timeout} from '../utils/timeout.js';
import {Interval} from '../utils/interval.js';
import {TWEEN} from '../Tween.js';
/**
 *
 */

export class Snow extends Sculpt {
    constructor(id = 0,
                textureURL,
                areaSize = 15,
                particleSize = 0.02,
                particleCount = 2000,
                windSpeed = 0.5,
                gravity = 7) {
        super(id);

        this.textureURL = textureURL;
        this.areaSize = areaSize;
        this.particleSize = particleSize;
        this.particleCount = particleCount;
        this.particles = new THREE.Geometry();
        this.windSpeed = windSpeed / 50;
        this.gravity = gravity / 5;

        this.initialWindSpeed = this.windSpeed;
        this.initialGravity = this.gravity;

        this.needsReset = false;

        let flakeTexture = new THREE.TextureLoader().load(this.textureURL);

        this.material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: this.particleSize,
            map: flakeTexture,
            transparent: true,
            opacity: 0.7
        });

        let resetVelocityX = (velocity) => {
            velocity.x = -Math.randomFloatIn(0.4, 1) * this.windSpeed;
        };
        let resetVelocityY = (velocity) => {
            velocity.y = -Math.randomFloatIn(0.4, 1) * this.gravity / 100;
        };
        let resetVelocityZ = (velocity) => {
            velocity.z = (0.5 - Math.random()) * 0.0005;
        };

        let count = this.particleCount;
        while (count--) {
            let px = Math.random() * this.areaSize - this.areaSize / 2,
                py = Math.random() * this.areaSize - this.areaSize / 2,
                pz = Math.random() * this.areaSize - this.areaSize / 2;
            let particle = new THREE.Vector3(px, py, pz);

            particle.velocity = new THREE.Vector3(0, 0, 0);
            resetVelocityX(particle.velocity);
            resetVelocityY(particle.velocity);
            resetVelocityZ(particle.velocity);
            this.particles.vertices.push(particle);
        }

        this.pointCloud = new THREE.Points(this.particles, this.material);

        this.pointCloud.sortParticles = true;

        super.init(this.pointCloud);

        timeout(() => {
            this.emit("ready", new Event(this));
        }, 0);

        this.on("update", (evt) => {

            let count = this.particleCount;
            let resetVelocities = this.needsReset;
            while (count--) {
                let particle = this.particles.vertices[count];
                //
                if (particle.x < -this.areaSize / 2) {
                    particle.x = this.areaSize / 2;
                    resetVelocityX(particle.velocity);
                } else if (particle.x > this.areaSize / 2) {
                    particle.x = -this.areaSize / 2;
                    resetVelocityX(particle.velocity);
                }
                if (particle.y < -this.areaSize / 2) {
                    particle.y = this.areaSize / 2;
                    resetVelocityY(particle.velocity);
                } else if (particle.y > this.areaSize / 2) {
                    particle.y = -this.areaSize / 2;
                    resetVelocityY(particle.velocity);
                }
                if (particle.z < -this.areaSize / 2 || particle.z > this.areaSize / 2) {
                    particle.z = 0;
                    resetVelocityZ(particle.velocity);
                }

                //particle.velocity.x -= Math.randomFloatIn(0.7, 1) * this.windSpeed / 100;
                //particle.velocity.y -= -Math.randomFloatIn(0.7, 1) * this.windSpeed / 100;
                particle.add(particle.velocity);
                if (resetVelocities) {
                    resetVelocityX(particle.velocity);
                    resetVelocityY(particle.velocity);
                    resetVelocityZ(particle.velocity);

                }
            }
            this.needsReset = false;

            this.pointCloud.geometry.__dirtyVertices = true;

            this.pointCloud.geometry.verticesNeedUpdate = true;
        })

    }

    changeSpeed(gravity = 1, windSpeed = 1) {
        this.gravity = this.initialGravity * gravity;
        this.windSpeed = this.initialWindSpeed * windSpeed;
        this.needsReset = true;
    }

}