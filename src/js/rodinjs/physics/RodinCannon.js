import {THREE} from '../../vendor/three/THREE.GLOBAL.js';

import '../../vendor/cannon/cannon.js';
import '../../vendor/oimo/oimo.js';
import {RigidBody} from './RigidBody.js';
import * as PhysicsUtils from '../utils/physicsUtils.js';

// todo make singleton

export class RodinPhysics {

    /**
     *
     * @param {string, ''} id Required
     * @param {string, ''} physicsEngine
     */
    constructor(id = "", physicsEngine) {

        this.rigidBodies = [];
        this.id = id;
        this.physicsEngine = physicsEngine;

        // The time between each step
        this.fixedTimeStep = 1.0 / 60.0; // seconds // timestep
        this.maxSubSteps = 3;
        this.lastTime = undefined;

        // creating physics world
        if (!this.physicsEngine) {
            this.physicsEngine = 'oimo';
        }
        if (this.physicsEngine === 'cannon') {
            this.world = new CANNON.World();
            this.world.broadphase = new CANNON.NaiveBroadphase();
        }


        // world setting:( TimeStep, BroadPhaseType, Iterations )
        // BroadPhaseType can be
        // 1 : BruteForce
        // 2 : Sweep and prune , the default
        // 3 : dynamic bounding volume tree
        if (this.physicsEngine === 'oimo') {

            // Algorithm used for collision
            // 1: BruteForceBroadPhase  2: sweep and prune  3: dynamic bounding volume tree
            // default is 2 : best speed and lower cpu use.
            let boardphase = 2;

            // create oimo world contains all rigidBodys and joint.
            this.world = new OIMO.World(this.fixedTimeStep, boardphase);
            //populate(1);
        }
    }

    static instance;

    /**
     * Returns the appropriate instance
     * of the physics to use.
     *
     * @param {string, ''} physicsEngine
     **/
    static getInstance(physicsEngine) {
        this.physicsEngine = physicsEngine;
        if (!RodinPhysics.instance)
            RodinPhysics.instance = new RodinPhysics('0', this.physicsEngine);
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
    setupWorldGeneralParameters(gravityX = 0, gravityY = 0, gravityZ = 0, iterations = 8, quatNormalizeFast, quatNormalizeSkip) {
        if (this.physicsEngine === 'cannon') {
            this.world.gravity.set(gravityX, gravityY, gravityZ); // m/s²
            // Max solver iterations: Use more for better force propagation, but keep in mind that it's not very computationally cheap!
            this.world.solver.iterations = iterations;
            // Since we have many bodies and they don't move very much, we can use the less accurate quaternion normalization
            //this.world.quatNormalizeFast = quatNormalizeFast;
            //this.world.quatNormalizeSkip = quatNormalizeSkip; // ...and we do not have to normalize every step.
        }
        if (this.physicsEngine === 'oimo') {
            this.world.gravity = new OIMO.Vec3(gravityX, gravityY, gravityZ);
            // The number of iterations for constraint solvers : default 8.
            this.world.numIterations = iterations;
            // calculate statistique or not
            this.world.isNoStat = false;

            this.world.worldscale(100);
        }
    }

    /**
     *
     * @param {{}} rigidBody
     */
    addRigidBodyToWorld(rigidBody) {
        if (this.physicsEngine === 'cannon') {
            this.world.addBody(rigidBody.body);
        }

        if (this.physicsEngine === 'oimo') {
            rigidBody.body = this.world.add(rigidBody.body);
        }
        this.rigidBodies.push(rigidBody);
    }

    /**
     *
     * @param {number, 0} timestamp
     */
    updateWorldPhysics(timestamp = 0) {
        if (!this.world) return;

        /*if (this.physicsEngine === 'cannon') {
         if (this.lastTime !== undefined) {
         let dt = (timestamp - this.lastTime) / 1000;
         this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
         }
         if (this.world.numObjects() > 0) {
         let i = this.rigidBodies.length;
         while (i--) {
         this.rigidBodies[i].owner.position.set(
         this.rigidBodies[i].body.position.x,
         this.rigidBodies[i].body.position.y,
         this.rigidBodies[i].body.position.z
         );
         let newRotation = new CANNON.Quaternion();
         this.rigidBodies[i].body.quaternion.mult(RigidBody.threeToCannonAxis.inverse(), newRotation);
         this.rigidBodies[i].owner.quaternion.set(
         newRotation.x,
         newRotation.y,
         newRotation.z,
         newRotation.w
         );
         }
         }
         this.lastTime = timestamp;
         }*/
        if (this.lastTime !== undefined) {
            let dt = (timestamp - this.lastTime) / 1000;
            this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
        }
        let i = this.rigidBodies.length;
        /*if (this.physicsEngine === 'cannon') {
         //if (this.world.numObjects() > 0) {
         while (i--) {
         this.rigidBodies[i].owner.position.set(
         this.rigidBodies[i].body.position.x,
         this.rigidBodies[i].body.position.y,
         this.rigidBodies[i].body.position.z
         );
         let newRotation = new CANNON.Quaternion();
         this.rigidBodies[i].body.quaternion.mult(RigidBody.threeToCannonAxis.inverse(), newRotation);
         this.rigidBodies[i].owner.quaternion.set(
         newRotation.x,
         newRotation.y,
         newRotation.z,
         newRotation.w
         );
         }
         //}
         }*/
        //if (this.physicsEngine === 'oimo') {
        while (i--) {
            //if (!this.rigidBodies[i].sleeping) {
            let newGlobalMatrix = new THREE.Matrix4();
            newGlobalMatrix.compose(
                PhysicsUtils.oimoToThree(this.rigidBodies[i].body.position),
                PhysicsUtils.oimoToThree(this.rigidBodies[i].body.getQuaternion()),
                //todo parent scale
                this.rigidBodies[i].owner.scale);

            let inverseParentMatrix = new THREE.Matrix4();
            inverseParentMatrix.getInverse(this.rigidBodies[i].owner.parent.matrixWorld);
            newGlobalMatrix.multiplyMatrices(inverseParentMatrix, newGlobalMatrix);

            this.rigidBodies[i].owner.matrixAutoUpdate = false;
            //this.rigidBodies[i].owner.matrixWorldNeedsUpdate = false;
            this.rigidBodies[i].owner.matrix = newGlobalMatrix;
            //}
        }
        //}
        this.lastTime = timestamp;
    }
}