import {THREE} from '../../vendor/three/THREE.GLOBAL.js';

import '../../vendor/cannon/cannon.js';
import {RigidBody} from './RigidBody.js';


// todo make singleton

export class RodinPhysics {

    /**
     *
     * @param {string, ""} id Required
     */
    constructor(id = "") {

        this.rigidBodies = [];
        this.id = id;

        this.fixedTimeStep = 1.0 / 60.0; // seconds
        this.maxSubSteps = 3;
        this.lastTime = undefined;

        // creating physics world
        this.world = new CANNON.World();
        this.world.broadphase = new CANNON.NaiveBroadphase();
    }

    static instance;

    /**
     * Returns the appropriate instance
     * of the physics to use.
     **/
    static getInstance()
    {
        if (!RodinPhysics.instance)
            RodinPhysics.instance = new RodinPhysics('0');
        return RodinPhysics.instance;
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
        this.world.gravity.set(gravityX, gravityY, gravityZ); // m/s²
        // Max solver iterations: Use more for better force propagation, but keep in mind that it's not very computationally cheap!
        this.world.solver.iterations = iterations;
        // Since we have many bodies and they don't move very much, we can use the less accurate quaternion normalization
        //this.world.quatNormalizeFast = quatNormalizeFast;
        //this.world.quatNormalizeSkip = quatNormalizeSkip; // ...and we do not have to normalize every step.
    }

    /**
     *
     * @param {{}} rigidBody
     */
    addRigidBodyToWorld(rigidBody) {
        this.world.addBody(rigidBody.rigidBody);
        this.rigidBodies.push(rigidBody);
    }

    /**
     *
     * @param {number, 0} timestamp
     */
    updateWorldPhysics(timestamp = 0) {
        if (this.lastTime !== undefined) {
            let dt = (timestamp - this.lastTime) / 1000;
            this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
        }

        if (this.world.numObjects() > 0) {
            for (let i = 0; i < this.rigidBodies.length; i++) {
                this.rigidBodies[i].owner.position.set(this.rigidBodies[i].rigidBody.position.x,
                                                       this.rigidBodies[i].rigidBody.position.y,
                                                       this.rigidBodies[i].rigidBody.position.z);

                let newRotation = new CANNON.Quaternion();
                this.rigidBodies[i].rigidBody.quaternion.mult(RigidBody.threeToCannonAxis.inverse(), newRotation);
                this.rigidBodies[i].owner.quaternion.set(newRotation.x,
                                                         newRotation.y,
                                                         newRotation.z,
                                                         newRotation.w);
            }
        }
        this.lastTime = timestamp;
    }
}