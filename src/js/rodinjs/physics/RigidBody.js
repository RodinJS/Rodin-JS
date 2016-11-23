import {THREE} from '../../vendor/three/THREE.GLOBAL.js';

import '../../vendor/cannon/cannon.js';
import '../../vendor/oimo/oimo.js';


import {RodinPhysics} from './RodinPhysics.js';

export class RigidBody {
    
    /**
     *
     * @param {object, null} object
     */
    //constructor(object = null, mass = 0, type = undefined, name) {
    //object: ground,
    //mass: 0,
    //type: "plane",
    //static: true
    constructor(object) {

        this.physicsEngine = RodinPhysics.physicsEngine;

        this.object = object || null;
        this.owner = this.object.mesh || null;
        this.name = this.object.name || '';
        this.type = this.object.type || '';
        this.dynamic = this.object.dynamic;

        if (!this.type) {
            this.type = this.owner.geometry.type;
        }

        if (!this.physicsEngine) {
            return;
        }
        if (this.physicsEngine === 'cannon') {
            if (!RigidBody.threeToCannonAxis) {
                let qX = new CANNON.Quaternion();
                qX.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
                let qY = new CANNON.Quaternion();
                qY.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI);
                let qXY = new CANNON.Quaternion();
                qY.mult(qX, qXY);

                RigidBody.threeToCannonAxis = qXY;
            }

            if (this.owner) {
                // calculate new quaternion for Z-up axis
                let qOBJ = new CANNON.Quaternion(this.owner.quaternion.x,
                                                 this.owner.quaternion.y,
                                                 this.owner.quaternion.z,
                                                 this.owner.quaternion.w);
                let qObjXY = new CANNON.Quaternion();
                qOBJ.mult(RigidBody.threeToCannonAxis, qObjXY);

                // create mesh's rigidBody
                this.body = new CANNON.Body({
                    mass: this.mass, // kg
                    position: new CANNON.Vec3(this.owner.parent.position.x + this.owner.position.x,
                                              this.owner.parent.position.y + this.owner.position.y,
                                              this.owner.parent.position.z + this.owner.position.z), // m
                    quaternion: qObjXY // radian
                });

                this.body.updateMassProperties();
                this.body.addShape(this.createObjectCollision(this.type));
            }
        }
        if (this.physicsEngine === 'oimo') {
            //changeParent(this.owner, this.owner.parent);
            //console.log("position",this.owner.position);
            //console.log("getWorldPosition()",this.owner.getWorldPosition());
            this.body = {
                type: this.createObjectCollision(this.type),
                size: this.createObjectCollision.size,
                pos: [this.owner.getWorldPosition().x * 100,
                      this.owner.getWorldPosition().y * 100,
                      this.owner.getWorldPosition().z * 100],
                rot: [(this.owner.getWorldRotation().x * 180) / Math.PI,
                      (this.owner.getWorldRotation().y * 180) / Math.PI,
                      (this.owner.getWorldRotation().z * 180) / Math.PI],
                move: this.dynamic,
                world: RodinPhysics.world,
                //flat: true,
                mass: this.mass
            };
            //this.deltaPos = {x: this.owner.getWorldPosition().x - this.owner.position.x,
            //                 y: this.owner.getWorldPosition().y - this.owner.position.y,
            //                 z: this.owner.getWorldPosition().z - this.owner.position.z};

            this.deltaPos = new THREE.Vector3(
                                    this.owner.getWorldPosition().x/* - this.owner.position.x*/,
                                    this.owner.getWorldPosition().y/* - this.owner.position.y*/,
                                    this.owner.getWorldPosition().z/* - this.owner.position.z*/);

            this.deltaRot = {x: this.owner.getWorldRotation().x - this.owner.rotation.x,
                             y: this.owner.getWorldRotation().y - this.owner.rotation.y,
                             z: this.owner.getWorldRotation().z - this.owner.rotation.z};
            this.deltaQuat = this.owner.getWorldQuaternion().multiply(this.owner.quaternion.inverse());
            /*this.deltaQuat = new THREE.Quaternion();
            this.deltaQuat.set(deltaQuat.x,
                               deltaQuat.y,
                               deltaQuat.z,
                               deltaQuat.w);*/
            console.log(this.deltaQuat);
        }
        RodinPhysics.getInstance(this.physicsEngine).addRigidBodyToWorld(this);
    }

    get mass(){
        return this.object.mass || 0;
    }
    set mass(m){
        this.object.mass = m;
    }

    static threeToCannonAxis = null;

    /**
     *
     * @param {string, undefined} type
     */
    createObjectCollision(type) {
        if (type == undefined) {
            type = "";
        }

        let shape;
        let param = this.owner.geometry.parameters;
        this.createObjectCollision.size = [];

        switch (type) {
            case 'PlaneBufferGeometry':
            case 'PlaneGeometry':
            case 'plane':
                if (this.physicsEngine === 'cannon') {
                    //
                    // todo 0.00001 find a better solution
                    // todo hight esim inch
                    shape = new CANNON.Box(new CANNON.Vec3(param.width / 2, 0.00001, param.height / 2));
                    //shape = new CANNON.Plane();
                    //this.rigidBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

                } else {
                    shape = '';
                    this.createObjectCollision.size.push(...[param.width * 100, param.height * 100, 0.002 ]);
                }
                break;

            case 'BoxBufferGeometry':
            case 'BoxGeometry':
            case 'box':
            case '':
                if (this.physicsEngine === 'cannon') {
                    //half extents
                    shape = new CANNON.Box(new CANNON.Vec3(param.width / 2, param.depth / 2, param.height / 2));
                } else {
                    shape = 'box';
                    this.createObjectCollision.size.push(...[param.width * 100, param.height * 100, param.depth * 100]);
                }
                break;

            case 'SphereBufferGeometry':
            case 'SphereGeometry':
            case 'sphere':
                if (this.physicsEngine === 'cannon') {
                    shape = new CANNON.Sphere(param.radius);
                } else {
                    shape = 'sphere';
                    this.createObjectCollision.size.push(param.radius * 100);
                }
                break;

           /* case 'ConeBufferGeometry"':
            case 'ConeGeometry':
            case 'cone':
                // todo 0.00001 find a better solution
                shape = new CANNON.Cylinder(0.00001, param.radius, param.height, param.radialSegments);
                break;

            case 'CylinderBufferGeometry':
            case 'CylinderGeometry':
            case 'cylinder':
                shape = new CANNON.Cylinder(param.radiusTop, param.radiusBottom, param.height, param.radialSegments);
                break;

            case 'TorusBufferGeometry':
            case 'TorusGeometry':
                shape = new CANNON.Trimesh.createTorus(param.radius, param.tube, param.radialSegments, param.tubularSegments);
                break;

            default:
                // todo convex polyhedron
                /!*var bunnyBody = new CANNON.Body({ mass: 1 });
                 for(var i=0; i<bunny.length; i++){

                 var rawVerts = bunny[i].verts;
                 var rawFaces = bunny[i].faces;
                 var rawOffset = bunny[i].offset;

                 var verts=[], faces=[], offset;

                 // Get vertices
                 for(var j=0; j<rawVerts.length; j+=3){
                 verts.push(new CANNON.Vec3( rawVerts[j]  ,
                 rawVerts[j+1],
                 rawVerts[j+2]));
                 }

                 // Get faces
                 for(var j=0; j<rawFaces.length; j+=3){
                 faces.push([rawFaces[j],rawFaces[j+1],rawFaces[j+2]]);
                 }

                 // Get offset
                 offset = new CANNON.Vec3(rawOffset[0],rawOffset[1],rawOffset[2]);

                 // Construct polyhedron
                 var bunnyPart = new CANNON.ConvexPolyhedron(verts,faces);

                 // Add to compound
                 bunnyBody.addShape(bunnyPart,offset);
                 }*!/

                let tmpFaces = [], tmpVerts = [];
                for (let i = 0; i < this.owner.geometry.faces.length; i++) {
                    tmpFaces.push(this.owner.geometry.faces[i].a);
                    tmpFaces.push(this.owner.geometry.faces[i].b);
                    tmpFaces.push(this.owner.geometry.faces[i].c);
                }
                for (let i = 0; i < this.owner.geometry.vertices.length; i++) {
                    tmpVerts.push(this.owner.geometry.vertices[i].x);
                    tmpVerts.push(this.owner.geometry.vertices[i].y);
                    tmpVerts.push(this.owner.geometry.vertices[i].z);
                }
                shape = new CANNON.Trimesh(tmpVerts, tmpFaces);*/
            default: return
        }

        //console.log(shape);
        return shape;
    }

    // todo delete rigidBody
}
