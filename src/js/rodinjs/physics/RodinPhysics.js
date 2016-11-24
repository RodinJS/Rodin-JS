import {THREE} from '../../vendor/three/THREE.GLOBAL.js';

import '../../vendor/cannon/cannon.js';
import '../../vendor/oimo/oimo.js';
import {RigidBody} from './RigidBody.js';
import changeParent  from '../../rodinjs/utils/ChangeParent.js';



// todo make singleton

export class RodinPhysics {

    /**
     *
     * @param {string, ""} id Required
     * @param {string, ""} physicsEngine
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
            this.physicsEngine = "oimo";
        }
        if (this.physicsEngine === "cannon") {
            this.world = new CANNON.World();
            this.world.broadphase = new CANNON.NaiveBroadphase();
        }


        // world setting:( TimeStep, BroadPhaseType, Iterations )
        // BroadPhaseType can be
        // 1 : BruteForce
        // 2 : Sweep and prune , the default
        // 3 : dynamic bounding volume tree
        if (this.physicsEngine === "oimo") {

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
     * @param {string, ""} physicsEngine
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
        if (this.physicsEngine === "cannon") {
            this.world.gravity.set(gravityX, gravityY, gravityZ); // m/s²
            // Max solver iterations: Use more for better force propagation, but keep in mind that it's not very computationally cheap!
            this.world.solver.iterations = iterations;
            // Since we have many bodies and they don't move very much, we can use the less accurate quaternion normalization
            //this.world.quatNormalizeFast = quatNormalizeFast;
            //this.world.quatNormalizeSkip = quatNormalizeSkip; // ...and we do not have to normalize every step.
        }
        if (this.physicsEngine === "oimo") {
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
        if (this.physicsEngine === "cannon") {
            this.world.addBody(rigidBody.body);
        }

        if (this.physicsEngine === "oimo") {
            rigidBody.body = this.world.add(rigidBody.body);
        }
        this.rigidBodies.push(rigidBody);
        //console.log("owner", rigidBody.owner.position);
        //console.log("ownerWorld", rigidBody.owner.getWorldPosition());
    }

    /**
     *
     * @param {number, 0} timestamp
     */
    updateWorldPhysics(timestamp = 0) {
        if (!this.world) return;

        if (this.physicsEngine === "cannon") {
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
        }

        if (this.physicsEngine === "oimo") {
            this.world.step();

            let i = this.rigidBodies.length;
            while (i--) {
                if (!this.rigidBodies[i].sleeping) {
                    //let tmpPosDelta = this.rigidBodies[i].deltaPos.clone();
                    //tmpPosDelta.applyQuaternion(this.rigidBodies[i].owner.parent.getWorldQuaternion().inverse());

                    /*this.rigidBodies[i].owner.position.set(
                        this.rigidBodies[i].body.position.x - this.rigidBodies[i].deltaPos.x,
                        this.rigidBodies[i].body.position.y - this.rigidBodies[i].deltaPos.y,
                        this.rigidBodies[i].body.position.z - this.rigidBodies[i].deltaPos.z
                    );*/

                    /*this.rigidBodies[i].owner.position.set(
                        this.rigidBodies[i].body.position.x - tmpPosDelta.x,
                        this.rigidBodies[i].body.position.y - tmpPosDelta.y,
                        this.rigidBodies[i].body.position.z - tmpPosDelta.z
                    );*/

                    let obj = new THREE.Object3D();
                    obj.position.set(
                        this.rigidBodies[i].body.position.x,
                        this.rigidBodies[i].body.position.y,
                        this.rigidBodies[i].body.position.z
                    );

                    changeParent(obj, this.rigidBodies[i].owner.parent);
                    this.rigidBodies[i].owner.position.copy(obj.position);

                    //let pos = obj.worldToLocal(this.rigidBodies[i].owner.getWorldPosition());
                    console.log("owner", this.rigidBodies[i].owner.position);
                    //console.log("pos", pos);
                    console.log("body", this.rigidBodies[i].body.position);
                    console.log("________");
                    obj.parent.remove(obj);
                    obj = null;
                    //console.log("pos-world", this.rigidBodies[i].owner.getWorldPosition());
                    //this.rigidBodies[i].owner.position.set(pos);

                    //this.rigidBodies[i].owner.updateMatrixWorld();
                    /*let bodyQuat = new THREE.Quaternion();
                    bodyQuat.set(this.rigidBodies[i].body.getQuaternion().x,
                                 this.rigidBodies[i].body.getQuaternion().y,
                                 this.rigidBodies[i].body.getQuaternion().z,
                                 this.rigidBodies[i].body.getQuaternion().w);
                    let a = bodyQuat.multiply(this.rigidBodies[i].deltaQuat);
                    this.rigidBodies[i].owner.quaternion.copy(a);*/
                }
            }
        }
    }
}