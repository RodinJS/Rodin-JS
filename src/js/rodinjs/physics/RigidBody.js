import {THREE} from '../../vendor/three/THREE.GLOBAL.js';

import '../../vendor/cannon/cannon.js';
import '../../vendor/oimo/oimo.js';

import {RodinPhysics} from './RodinPhysics.js';

export class RigidBody {
    /**
     *
     * @param {object, null} object
     * @param {number, 0} mass
     * @param {string, undefined} typeOfCollisionShape
     * @param {string, undefined} name
     */
    constructor(object = null, mass = 0, typeOfCollisionShape = undefined, name) {

        this.physicsEngine = RodinPhysics.physicsEngine;
        this.name = name || "";
        this.object = object;

        if (!typeOfCollisionShape) {
            typeOfCollisionShape = object.geometry.type;
        }

        if (!this.physicsEngine) {
            return;
        }
        if (this.physicsEngine === "cannon") {
            if (!RigidBody.threeToCannonAxis) {
                let qX = new CANNON.Quaternion();
                qX.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
                let qY = new CANNON.Quaternion();
                qY.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI);
                let qXY = new CANNON.Quaternion();
                qY.mult(qX, qXY);

                RigidBody.threeToCannonAxis = qXY;
            }

            if (this.object) {
                // calculate new quaternion for Z-up axis
                let qOBJ = new CANNON.Quaternion(this.object.quaternion.x,
                    this.object.quaternion.y,
                    this.object.quaternion.z,
                    this.object.quaternion.w);
                let qObjXY = new CANNON.Quaternion();
                qOBJ.mult(RigidBody.threeToCannonAxis, qObjXY);

                // create object's rigidBody
                this.body = new CANNON.Body({
                    mass: mass, // kg
                    position: new CANNON.Vec3(this.object.parent.position.x + this.object.position.x,
                        this.object.parent.position.y + this.object.position.y,
                        this.object.parent.position.z + this.object.position.z), // m
                    quaternion: qObjXY // radian
                });

                this.body.updateMassProperties();
                this.body.addShape(this.createObjectCollision(typeOfCollisionShape));
                this.owner = this.object;
            }
        }
        if (this.physicsEngine === "oimo") {
            if (typeOfCollisionShape == "ground") {
                this.body = {
                    size: [4, 0.1, 4],
                    pos: [0, 0, 5],
                    move: false,
                    world: RodinPhysics.world,
                    name: typeOfCollisionShape,
                    //mass: 0
                }
            } else {
                this.body = {
                    type: 'sphere',
                    pos: [0, 4, 5],
                    size: [0.2],
                    move: true,
                    world: RodinPhysics.world,
                    name: typeOfCollisionShape,
                    //mass: 1
                };
            }
            this.owner = this.object;
        }
        RodinPhysics.getInstance(this.physicsEngine).addRigidBodyToWorld(this);
    }

    static threeToCannonAxis = null;

    /**
     *
     * @param {string, undefined} typeOfCollisionShape
     */
    createObjectCollision(typeOfCollisionShape = undefined) {
        let shape;
        let param = this.object.geometry.parameters;

        switch (typeOfCollisionShape) {
            case "PlaneBufferGeometry":
            case "PlaneGeometry":
                //
                // todo 0.00001 find a better solution
                // todo hight esim inch
                shape = new CANNON.Box(new CANNON.Vec3(param.width / 2, 0.00001, param.height / 2));
                //shape = new CANNON.Plane();
                //this.rigidBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
                break;

            case "BoxBufferGeometry":
            case "BoxGeometry":
                //half extents
                shape = new CANNON.Box(new CANNON.Vec3(param.width / 2, param.depth / 2, param.height / 2));
                break;

            case "SphereBufferGeometry":
            case "SphereGeometry":
            case "sphere":
                shape = new CANNON.Sphere(param.radius);
                break;

            case "ConeBufferGeometry":
            case "ConeGeometry":
            case "cone":
                // todo 0.00001 find a better solution
                shape = new CANNON.Cylinder(0.00001, param.radius, param.height, param.radialSegments);
                break;

            case "CylinderBufferGeometry":
            case "CylinderGeometry":
                shape = new CANNON.Cylinder(param.radiusTop, param.radiusBottom, param.height, param.radialSegments);
                break;

            case "TorusBufferGeometry":
            case "TorusGeometry":
                shape = new CANNON.Trimesh.createTorus(param.radius, param.tube, param.radialSegments, param.tubularSegments);
                break;

            default:
                // todo convex polyhedron
                /*var bunnyBody = new CANNON.Body({ mass: 1 });
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
                 }*/

                let tmpFaces = [], tmpVerts = [];
                for (let i = 0; i < this.object.geometry.faces.length; i++) {
                    tmpFaces.push(this.object.geometry.faces[i].a);
                    tmpFaces.push(this.object.geometry.faces[i].b);
                    tmpFaces.push(this.object.geometry.faces[i].c);
                }
                for (let i = 0; i < this.object.geometry.vertices.length; i++) {
                    tmpVerts.push(this.object.geometry.vertices[i].x);
                    tmpVerts.push(this.object.geometry.vertices[i].y);
                    tmpVerts.push(this.object.geometry.vertices[i].z);
                }
                shape = new CANNON.Trimesh(tmpVerts, tmpFaces);
        }
        return shape;
    }

    // todo delete rigidBody
}
