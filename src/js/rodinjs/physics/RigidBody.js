import {THREE} from '../../vendor/three/THREE.GLOBAL.js';

import '../../vendor/cannon/cannon.js';
import '../../vendor/oimo/oimo.js';
import * as PhysicsUtils from '../utils/physicsUtils.js';

import {RodinPhysics} from './RodinPhysics.js';

import {SceneManager} from '../../../../_build/js/rodinjs/scene/SceneManager.js';
let scene = SceneManager.get();

export class RigidBody {

    /**
     * Constructor get object, which has properties: name, owner, type, mass, move
     * @param {object} object
     */
    constructor(object) {

        this.physicsEngine = RodinPhysics.physicsEngine;
        this.object = object;

        if (!this.physicsEngine) return;
        if (!this.object) return;

        let _enabled = true;
        this.enable = () => {
            _enabled = true;
        };

        this.disable = () => {
            _enabled = false;
        };

        this.enabled = () => {
            return _enabled;
        };

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

            // calculate new quaternion for Z-up axis
            let qOBJ = new CANNON.Quaternion(
                this.owner.getWorldQuaternion().x,
                this.owner.getWorldQuaternion().y,
                this.owner.getWorldQuaternion().z,
                this.owner.getWorldQuaternion().w);
            let qObjXY = new CANNON.Quaternion();
            qOBJ.mult(RigidBody.threeToCannonAxis, qObjXY);

            // create mesh's rigidBody
            this.body = new CANNON.Body({
                mass: this.mass, // kg
                position: new CANNON.Vec3(
                    this.owner.getWorldPosition().x,
                    this.owner.getWorldPosition().y,
                    this.owner.getWorldPosition().z), // m
                quaternion: qObjXY // radian
            });

            this.body.updateMassProperties();
            this.body.addShape(this.createObjectCollision(this.type));
        }
        if (this.physicsEngine === 'oimo') {
            this.body = {
                type: this.createObjectCollision(this.type),
                size: this.createObjectCollision.size,
                pos: [
                    this.owner.getWorldPosition().x * 100,
                    this.owner.getWorldPosition().y * 100,
                    this.owner.getWorldPosition().z * 100], // m
                rot: [
                    this.owner.getWorldRotation().x * (180 / Math.PI),
                    this.owner.getWorldRotation().y * (180 / Math.PI),
                    this.owner.getWorldRotation().z * (180 / Math.PI),], // angle
                move: this.move,
                mass: this.mass,
                world: RodinPhysics.world
            };
        }
        RodinPhysics.getInstance(this.physicsEngine).addRigidBodyToWorld(this);
    }

    static threeToCannonAxis = null;

    /**
     *
     * @param {string, undefined} type
     */
    createObjectCollision(type) {
        if (type == undefined) {
            type = '';
        }

        let shape;
        let param = {};
        let isGeometry;

        if (this.owner.geometry.parameters) {
            isGeometry = true;
            param = this.owner.geometry.parameters;
        }

        this.createObjectCollision.size = [];

        switch (type) {
            case 'PlaneBufferGeometry':
            case 'PlaneGeometry':
            case 'plane':
                if (!isGeometry) {
                    this.owner.geometry.computeBoundingBox();
                    let bBox = this.owner.geometry.boundingBox;
                    param.width = Math.abs(bBox.max.x) + Math.abs(bBox.min.x);
                    param.height = Math.abs(bBox.max.y) + Math.abs(bBox.min.y);
                    param.depth = 0.002;

                    // delete this
                    let mesh = new THREE.Mesh(
                        new THREE.BoxGeometry(param.width, param.height, param.depth),
                        new THREE.MeshBasicMaterial({color: 0xaaaaaa, wireframe: true})
                    );
                    this.owner.add(mesh);
                }

                if (this.physicsEngine === 'cannon') {
                    //
                    // todo 0.00001 find a better solution
                    shape = new CANNON.Box(new CANNON.Vec3(param.width / 2, param.depth, param.height / 2));
                    //shape = new CANNON.Plane();
                    //this.rigidBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

                } else {
                    shape = '';
                    this.createObjectCollision.size.push(...[param.width * 100, param.height * 100, param.depth]);
                }
                break;

            case 'BoxBufferGeometry':
            case 'BoxGeometry':
            case 'box':
            case '':
                if (!isGeometry) {
                    this.owner.geometry.computeBoundingBox();
                    let bBox = this.owner.geometry.boundingBox;
                    param.width = Math.abs(bBox.max.x) + Math.abs(bBox.min.x);
                    param.height = Math.abs(bBox.max.y) + Math.abs(bBox.min.y);
                    param.depth = Math.abs(bBox.max.z) + Math.abs(bBox.min.z);

                    // delete this
                    let mesh = new THREE.Mesh(
                        new THREE.BoxGeometry(param.width, param.height, param.depth),
                        new THREE.MeshBasicMaterial({color: 0xaaaaaa, wireframe: true})
                    );
                    this.owner.add(mesh);
                }

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
                if (!isGeometry) {
                    this.owner.geometry.computeBoundingSphere();
                    let bSphere = this.owner.geometry.boundingSphere;
                    param.radius = bSphere.radius;

                    // delete this
                    let mesh = new THREE.Mesh(
                        new THREE.SphereGeometry(param.radius, 10),
                        new THREE.MeshBasicMaterial({color: 0xaaaaaa, wireframe: true})
                    );
                    this.owner.add(mesh);
                }

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
            default:
                return
        }
        return shape;
    }

    // todo delete rigidBody

    get name() {
        return this.object.name || "";
    }

    set name(n) {
        this.object.name = n;
    }

    get owner() {
        // todo if owner is null
        return this.object.owner;
    }

    set owner(o) {
        this.object.owner = o;
    }

    get type() {
        return this.object.type || this.owner.geometry.type || "";
    }

    set type(t) {
        this.object.type = t;
    }

    get move() {
        return this.object.move;
    }

    set move(m) {
        this.object.move = m;
    }

    get mass() {
        return this.object.mass || 0;
    }

    set mass(m) {
        this.object.mass = m;
    }
}
