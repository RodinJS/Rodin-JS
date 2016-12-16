//
// import {THREE} from '../../vendor/three/THREE.GLOBAL.js';
//
// import {RodinPhysics} from "./RodinPhysics.js";
//
//
// import '../../vendor/oimo/oimo.js';
// import * as PhysicsUtils from '../utils/physicsUtils.js';
//
// export class RodinOimo extends RodinPhysics{
//
//     /**
//      *
//      */
//     constructor() {
//         this.rigidBodies = [];
//
//         // The time between each step
//         this.fixedTimeStep = 1.0 / 60.0; // seconds // timestep
//         this.maxSubSteps = 3;
//         this.lastTime = undefined;
//
//         // world setting:( TimeStep, BroadPhaseType, Iterations )
//         // BroadPhaseType can be
//         // 1 : BruteForce
//         // 2 : Sweep and prune , the default
//         // 3 : dynamic bounding volume tree
//
//         // Algorithm used for collision
//         // 1: BruteForceBroadPhase  2: sweep and prune  3: dynamic bounding volume tree
//         // default is 2 : best speed and lower cpu use.
//         let boardphase = 2;
//
//         // create oimo world contains all rigidBodys and joint.
//         this.world = new OIMO.World(this.fixedTimeStep, boardphase);
//         //populate(1);
//     }
//
//     /**
//      *
//      * Setting up the scene default parameters
//      * @param {number, 0} gravityX
//      * @param {number, 0} gravityY
//      * @param {number, 0} gravityZ
//      * @param {number, 10} iterations
//      */
//     setupWorldGeneralParameters(gravityX = 0, gravityY = 0, gravityZ = 0, iterations = 8) {
//         this.world.gravity = new OIMO.Vec3(gravityX, gravityY, gravityZ);
//         // The number of iterations for constraint solvers : default 8.
//         this.world.numIterations = iterations;
//         // calculate statistique or not
//         this.world.isNoStat = false;
//
//         this.world.worldscale(100);
//     }
//
//     /**
//      *
//      * @param {{}} rigidBody
//      */
//     addRigidBodyToWorld(rigidBody) {
//         rigidBody.body = this.world.add(rigidBody.body);
//         this.rigidBodies.push(rigidBody);
//     }
//
//     /**
//      *
//      * @param {number, 0} timestamp
//      */
//     updateWorldPhysics(timestamp = 0) {
//         if (!this.world) return;
//
//         if (this.lastTime !== undefined) {
//             let dt = (timestamp - this.lastTime) / 1000;
//             this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
//         }
//         let i = this.rigidBodies.length;
//         while (i--) {
//             if (!this.rigidBodies[i].sleeping) {
//                 let newGlobalMatrix = new THREE.Matrix4();
//                 newGlobalMatrix.compose(
//                     PhysicsUtils.oimoToThree(this.rigidBodies[i].body.position),
//                     PhysicsUtils.oimoToThree(this.rigidBodies[i].body.getQuaternion()),
//                     //todo parent scale
//                     this.rigidBodies[i].owner.scale);
//
//                 let inverseParentMatrix = new THREE.Matrix4();
//                 inverseParentMatrix.getInverse(this.rigidBodies[i].owner.parent.matrixWorld);
//                 newGlobalMatrix.multiplyMatrices(inverseParentMatrix, newGlobalMatrix);
//
//                 this.rigidBodies[i].owner.matrixAutoUpdate = false;
//                 //this.rigidBodies[i].owner.matrixWorldNeedsUpdate = false;
//                 this.rigidBodies[i].owner.matrix = newGlobalMatrix;
//             }
//             this.lastTime = timestamp;
//         }
//     }
// }