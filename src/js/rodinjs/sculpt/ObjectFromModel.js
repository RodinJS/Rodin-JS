import {Sculpt} from './Sculpt.js';
import { THREE } from '../../three/THREE.GLOBAL.js';
import * as CustomErrors from '../error/CustomErrors';
import { timeout } from '../utils/timeout.js';
import { Event } from '../Event.js';
import {SUPPORTED_MODEL_TYPES} from '../constants/constants.js';

// TODO check references below, this class currently depends on three.js examples
import '../../../../node_modules/three/examples/js/loaders/OBJLoader.js';
import '../../../../node_modules/three/examples/js/loaders/FBXLoader.js';
import '../../../../node_modules/three/examples/js/loaders/ColladaLoader.js';
import '../../../../node_modules/three/examples/js/loaders/DDSLoader.js';
import '../../../../node_modules/three/examples/js/loaders/MTLLoader.js';
import '../../../../src/js/rodinjs/vendor/JDLoader.min.js';


/**
 * Abstract class ObjectFromModel
 */
export class ObjectFromModel extends Sculpt {
    constructor(SubClass, objectGeometry ) {
        super();

        if (this.constructor === ObjectFromModel) {
            throw new CustomErrors.ErrorAbstractClassInstance();
        }

        if (!objectGeometry.url) {
            throw new CustomErrors.ErrorInvalidUrl('geometry.url');
        }

        if (!objectGeometry.type) {
            throw new CustomErrors.ErrorInvalidUrl('geometry.type');
        }

        SubClass.objectLoaded = SubClass.objectLoaded || false;
        SubClass.geometry = SubClass.geometry || {};
        SubClass.materials = SubClass.materials || [];
        SubClass.mixers = SubClass.mixers || [];

        if(!SubClass.objectLoaded) {
            // If supported model type is JSON or JS format
            if (objectGeometry.type === SUPPORTED_MODEL_TYPES.JSON || objectGeometry.type === SUPPORTED_MODEL_TYPES.JS) {

                /**
                 * If your model consists of several geometries
                 * and the material ids do not map in correct order,
                 * You can open the model in a 3d editing software,
                 * attach all geometries to a single object and export again.
                 */

                new THREE.JSONLoader().load(
                    objectGeometry.url,

                    (geometry, materials) => {

                        if (!geometry) {
                            throw new CustomErrors.ErrorInvalidFileFormat('geometry');
                        }
                        if (!materials) {
                            throw new CustomErrors.ErrorInvalidFileFormat('materials');
                        } else {

                            SubClass.geometry = geometry;
                            SubClass.materials = new THREE.MultiMaterial(materials);
                            SubClass.objectLoaded = true;

                            this.init(new THREE.Mesh(SubClass.geometry, SubClass.materials));
                            this.emit('ready', new Event(this));

                            console.log("JSON or JS file was loaded");
                        }
                    }
                )
            }

            // If supported model type is OBJ format
            if (objectGeometry.type === SUPPORTED_MODEL_TYPES.OBJ) {

                /**
                 * If You want to use OBJ file, for avoid path problem
                 * please export your file, material and texture in the same folder.
                 * And keep object and material name the same.
                 */

                THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

                var mtlLoader = new THREE.MTLLoader();

                var getMtlLoaderPath =  objectGeometry.url.slice( 0 , objectGeometry.url.lastIndexOf("/") + 1 );
                mtlLoader.setPath( getMtlLoaderPath );

                var mtlLoaderName = objectGeometry.url.slice( getMtlLoaderPath.length, objectGeometry.url.lastIndexOf(".") );
                mtlLoader.load( mtlLoaderName + '.mtl', ( materials ) => {
                    materials.preload();

                    var texturePath = "";
                    for (var materialName in materials.materialsInfo) {

                        if( materials.materialsInfo.hasOwnProperty(materialName) ) {
                            var mapKa = materials.materialsInfo[materialName].map_ka;
                            if( mapKa ){
                                texturePath = getMtlLoaderPath + mapKa.slice(mapKa.lastIndexOf("\\") + 1) ;
                                materials.materials[materialName].map = new THREE.TextureLoader().load(texturePath);
                            }
                        }
                    }

                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials( materials );
                    objLoader.load(
                        objectGeometry.url,

                        ( mesh ) => {
                            SubClass.objectLoaded = true;
                            this.init(mesh);
                            this.emit('ready', new Event(this));
                            console.log( "OBJ file was loaded" );
                        }

                    );
                })
            }

            // If supported model type is FBX format
            if (objectGeometry.type === SUPPORTED_MODEL_TYPES.FBX) {
                // model
                var manager = new THREE.LoadingManager();
                manager.onProgress = function( item, loaded, total ) {
                    console.log( item, loaded, total );
                };

                var onProgress = function( xhr ) {
                    if ( xhr.lengthComputable ) {

                        var percentComplete = xhr.loaded / xhr.total * 100;
                        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

                    }

                };

                var onError = function( xhr ) {
                };

                var loader = new THREE.FBXLoader( manager );
                loader.load( objectGeometry.url, function( object ) {
                    object.traverse( function( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            // pass
                        }

                        if ( child instanceof THREE.SkinnedMesh ) {
                            if ( child.geometry.animations !== undefined || child.geometry.morphAnimations !== undefined ) {
                                child.mixer = new THREE.AnimationMixer( child );
                                //mixers.push( child.mixer );
                                var action = child.mixer.clipAction( child.geometry.animations[ 0 ] );
                                action.play();
                            }
                        }
                    } );

                    this.init(object);
                    this.emit('ready', new Event(this));

                }, onProgress, onError );

            }

            // If supported model type is COLLADA format
            if (objectGeometry.type === SUPPORTED_MODEL_TYPES.COLLADA) {
                new THREE.ColladaLoader().load(
                    objectGeometry.url,

                    ( mesh ) => {
                        SubClass.objectLoaded = true;
                        //console.log(mesh);

                        let i=0;
                        for ( let material in mesh.dae.effects ){

                            if( mesh.dae.effects.hasOwnProperty(material )){

                                if( mesh.dae.effects[material].shader.diffuse.texture ){
                                    let texture = mesh.dae.effects[material].shader.diffuse.texture;

                                    for ( let map in mesh.dae.images ) {
                                        if ( mesh.dae.images.hasOwnProperty(map) ) {

                                            if( texture == mesh.dae.images[map].id ){

                                                if ( mesh.dae.images[map].init_from ) {

                                                    let init_from = mesh.dae.images[map].init_from;
                                                    let getMtlLoaderPath = objectGeometry.url.slice( 0, objectGeometry.url.lastIndexOf("/") + 1 );
                                                    let texturePath = getMtlLoaderPath + init_from.slice(init_from.lastIndexOf("\\") + 1);

                                                    //console.log( texturePath );
                                                    //console.log( i );
                                                    mesh.scene.children[0].children[0].material.materials[i].map = new THREE.TextureLoader().load( texturePath );
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            i++;
                        }

                        console.log("COLLADA file was loaded");

                        this.init(mesh.scene);
                        this.emit('ready', new Event(this));
                    }
                );
            }

            // If supported model type is JD format
            if (objectGeometry.type === SUPPORTED_MODEL_TYPES.JD) {

                //let mixers = [];
                let meshes = new THREE.Object3D;
                new THREE.JDLoader().load(
                    objectGeometry.url,

                    ( data ) => { // data: { materials, geometries, boundingSphere }

                        var multiMaterial = new THREE.MultiMaterial(data.materials);
                        for (var i = 0; i < data.geometries.length; ++i)
                        {

                            var mesh = new THREE.SkinnedMesh(data.geometries[i], multiMaterial);
                            meshes.add(mesh);

                            if (mesh.geometry.animations)
                            {
                                var mixer = new THREE.AnimationMixer(mesh);
                                SubClass.mixers.push(mixer);
                                mixer.clipAction(mesh.geometry.animations[0]).play();
                            }
                        }
                        /*function animate()
                        {
                            var delta = clock.getDelta();
                            for (var i = 0; i < mixers.length; ++i)
                                mixers[i].update(delta);
                            // ... the rest of your code
                        }*/
                        /*
                        let materials = mesh.materials;     // the global material array
                        let geometry = mesh.geometries[0];  // the first mesh
                        let skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
                        mixer = new THREE.AnimationMixer(skinnedMesh);
                        let action = mixer.clipAction(geometry.animations[0]);  // the first animation clip
                        action.play();
                        */

                        console.log("JD file was loaded");
                        //mixer.update(  new THREE.Clock().getDelta() );

                        this.init(meshes);
                        this.emit('ready', new Event(this));

                    }
                );
            }
        }else {
            timeout(() => {
                this.init(new THREE.Mesh(SubClass.geometry, SubClass.materials));
                this.emit('ready', new Event(this));
            });
        }
    }
}
