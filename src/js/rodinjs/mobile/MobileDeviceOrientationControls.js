import * as THREE from '../../three/Three.custom.js';

let instance = null;
var self;
export class MobileDeviceOrientationControls  {
	constructor(object) {
		if(!instance){
            instance = this;
        }

		this.object = object;
		this.object.rotation.reorder( "YXZ" );

		this.enabled = true;

		this.deviceOrientation = {};
		this.screenOrientation = 0;

		this.alpha = 0;
		this.alphaOffsetAngle = 0;
		this.connect();

		return instance;
	}



	onDeviceOrientationChangeEvent( event ) {
		// alert("gagoooooooooo");
		this.deviceOrientation = event;

	}

	onScreenOrientationChangeEvent() {

		this.screenOrientation = window.orientation || 0;

	}

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	setObjectQuaternion(quaternion, alpha, beta, gamma, orient) {
		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

		quaternion.setFromEuler( euler ); // orient the device

		quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

		quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

	}

	connect() {

		this.onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', () => this.onScreenOrientationChangeEvent(), false );
		window.addEventListener( 'deviceorientation', (e) => this.onDeviceOrientationChangeEvent(e), false );

		this.enabled = true;

	}

	disconnect() {

		window.removeEventListener( 'orientationchange', () => this.onScreenOrientationChangeEvent(), false );
		window.removeEventListener( 'deviceorientation', (e) => this.onDeviceOrientationChangeEvent(e), false );

		this.enabled = false;

	}

	update() {

		if ( this.enabled === false ) return;

		var alpha = this.deviceOrientation.alpha ? THREE.Math.degToRad( this.deviceOrientation.alpha ) + this.alphaOffsetAngle : 0; // Z
		var beta = this.deviceOrientation.beta ? THREE.Math.degToRad( this.deviceOrientation.beta ) : 0; // X'
		var gamma = this.deviceOrientation.gamma ? THREE.Math.degToRad( this.deviceOrientation.gamma ) : 0; // Y''
		var orient = this.screenOrientation ? THREE.Math.degToRad( this.screenOrientation ) : 0; // O

		this.setObjectQuaternion(this.object.quaternion, alpha, beta, gamma, orient);

		this.alpha = alpha;
	}

	updateAlphaOffsetAngle( angle ) {

		this.alphaOffsetAngle = angle;
		this.update();

	}

	dispose() {

		this.disconnect();

	}
};
