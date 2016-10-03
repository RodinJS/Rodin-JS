

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, controls;
var camera, scene, renderer;

var clock = new THREE.Clock();

var mixers = [];

init();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );

    scene = new THREE.Scene();

    // grid
    var gridHelper = new THREE.GridHelper( 14, 28, 0x303030, 0x303030 );
    gridHelper.position.set( 0, - 0.04, 0 );
    scene.add( gridHelper );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

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
    loader.load( 'models/fbx/xsi_man_skinning.fbx', function( object ) {

        object.traverse( function( child ) {

            if ( child instanceof THREE.Mesh ) {

                // pass

            }

            if ( child instanceof THREE.SkinnedMesh ) {

                if ( child.geometry.animations !== undefined || child.geometry.morphAnimations !== undefined ) {

                    child.mixer = new THREE.AnimationMixer( child );
                    mixers.push( child.mixer );

                    var action = child.mixer.clipAction( child.geometry.animations[ 0 ] );
                    action.play();

                }

            }

        } );

        scene.add( object );


    }, onProgress, onError );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000 );
    container.appendChild( renderer.domElement );

    // controls, camera
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 12, 0 );
    camera.position.set( 2, 18, 28 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize, false );

    animate();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    if ( mixers.length > 0 ) {

        for ( var i = 0; i < mixers.length; i ++ ) {

            mixers[ i ].update( clock.getDelta() );

        }

    }

    stats.update();

    render();

}

function render() {

    renderer.render( scene, camera );

}

		