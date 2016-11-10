import {THREE} from '../../three/THREE.GLOBAL.js';

import '../../../../_build/js/cannon/cannon.js';
import {RigidBody} from './RigidBody.js';


// todo make singleton

export class RodinPhysics {

    /**
     *
     * @param {string, ""} id Required
     */
    constructor(id = "") {

        this.id = id;

        this.fixedTimeStep = 1.0 / 60.0; // seconds
        this.maxSubSteps = 3;
        this.lastTime = undefined;

        // creating physics world
        this.world = new CANNON.World();
        this.world.broadphase = new CANNON.NaiveBroadphase();
    }

    /**
     *
     * Setting up the scene default parameters
     * @param {number, 0} gravityX
     * @param {number, 0} gravityY
     * @param {number, 0} gravityZ
     * @param {number, 10} iterations
     * @param {boolean} quatNormalizeFast
     * @param {number, 8} quatNormalizeSkip
     */
    setupWorldGeneralParameters(gravityX = 0, gravityY = 0, gravityZ = 0, iterations = 10, quatNormalizeFast, quatNormalizeSkip) {
        //let gravity = threeToCannon(gravityX, gravityY, gravityZ);
        //this.world.gravity.set(gravity[0], gravity[1], gravity[2]); // m/s²
        this.world.gravity.set(gravityX, gravityY, gravityZ); // m/s²
        // Max solver iterations: Use more for better force propagation, but keep in mind that it's not very computationally cheap!
        this.world.solver.iterations = iterations;
        // Since we have many bodies and they don't move very much, we can use the less accurate quaternion normalization
        this.world.quatNormalizeFast = quatNormalizeFast;
        this.world.quatNormalizeSkip = quatNormalizeSkip; // ...and we do not have to normalize every step.
    }

    /**
     *
     * @param {{}} rigidBody
     */
    addRigidBodyToWorld(rigidBody) {
        this.world.addBody(rigidBody);
    }

    /**
     *
     * @param {number, 0} timestamp
     * @param {[]} rigidBodies
     */
    updateWorldPhysics(timestamp = 0, rigidBodies) {
        if (this.lastTime !== undefined) {
            let dt = (timestamp - this.lastTime) / 1000;
            this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
        }
        if (this.world.numObjects() > 0) {
            for (let i = 0; i < rigidBodies.length; i++) {
                rigidBodies[i].owner.position.set(rigidBodies[i].position.x,
                                                  rigidBodies[i].position.y,
                                                  rigidBodies[i].position.z);

                let newRotation = new CANNON.Quaternion();
                rigidBodies[i].quaternion.mult(RigidBody.threeToCannonAxis.inverse(), newRotation);
                rigidBodies[i].owner.quaternion.set(newRotation.x,
                                                    newRotation.y,
                                                    newRotation.z,
                                                    newRotation.w);
            }
        }
        this.lastTime = timestamp;
    }
}