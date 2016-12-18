import {THREE} from '../../_build/js/vendor/three/THREE.GLOBAL.js';
import * as RODIN from '../../_build/js/rodinjs/RODIN.js';
import {SceneManager} from '../../_build/js/rodinjs/scene/SceneManager.js';
import {MouseController} from '../../_build/js/rodinjs/controllers/MouseController.js';
import {TWEEN} from '../../_build/js/rodinjs/Tween.js';
import {Element} from '../../_build/js/rodinjs/sculpt/elements/Element.js';
import {CubeObject} from '../../_build/js/rodinjs/sculpt/CubeObject.js';

let scene = SceneManager.get();
let camera = scene.camera;
let controls = scene.controls;
let renderer = scene.renderer;
let mouseController = new MouseController();
SceneManager.addController(mouseController);

const radToDeg = 180.0/Math.PI;
const degToRad = Math.PI/180.0;

// let skybox = new CubeObject(70, 'img/boxW.jpg');
// skybox.on(RODIN.CONSTANTS.EVENT_NAMES.READY, (evt) => {
    // scene.add(evt.target.object3D);
    // evt.target.object3D.position.y = controls.userHeight;
// });

let sceneAdvanced = new RODIN.THREEObject(scene);
sceneAdvanced.on("mousewheel", (evt) => {
	console.log(evt);
});

function initThumbs(thumbsUrls) {
	// let geometry = new THREE.CylinderGeometry(0.4, 0.4, 3, 32);
	// let material = new THREE.MeshBasicMaterial({
		// color: 0xffff00,
		// transparent: true,
		// opacity: 1
	// });
	// let cylinder = new THREE.Mesh(geometry, material);	
	// //cylinder.position.z = -2;	
	// scene.add(cylinder);
	
	let container = new THREE.Object3D();
	let allThumbsReady = false;
	let thumbLoadingIndex = 0;
	
	thumbsUrls.forEach((thumbUrl) => {
			let params = {};
			params.name = "name_";
			params.width = 0.9;
			params.height = 0.6;			
			params.border = {
					width: 0.01,
					color: 0x777777,
					opacity: 1,
					radius: 0.032
			};
			params.image = {
					url: thumbUrl,
					width: 0.9,
					height: 0.6,
					opacity: 1,
					position: {h: 50, v: 50}
			};
			let thumb = new Element(params);
			
			thumb.on('ready', (evt) => {
					let object = evt.target.object3D;					
					object.castShadow = true;
					object.receiveShadow = true;					
					container.add(object);					
					RODIN.Raycastables.push(object);
					
					evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_KEY, (evt) => {
							//console.log(evt);
					});					
					
					evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
							evt.target.animate(
									{
											property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
											to: new THREE.Vector3(1.1, 1.1, 1.1)
									}
							);
					});
					evt.target.on(RODIN.CONSTANTS.EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
							evt.target.animate(
									{
											property: RODIN.CONSTANTS.ANIMATION_TYPES.SCALE,
											to: new THREE.Vector3(1, 1, 1)
									}
							);

					});
					allThumbsReady = thumbLoadingIndex++ == thumbsUrls.length - 1;
			});			
	});
	
	let radius = 1;
	let phiStep = 2 * Math.PI/thumbsUrls.length;
	let phi = Math.PI * 0.5;
	let y = 1.5;
	
	let id = setInterval(()=> {
		let prevTheta = phi;
		if (allThumbsReady) {
			container.children.forEach((thumb, index) => {
				thumb.position.x = radius * Math.cos(phi);
				thumb.position.y = y;
				thumb.position.z = -radius * Math.sin(phi); 

				//console.log(thumb.position);				
				//let theta = Math.atan2(thumb.position.z, thumb.position.x);				
				//thumb.rotation.y += theta;
				
				phi += phiStep;
				
			});	
			scene.add(container);
			clearInterval(id);
		}		
	}, 1);
}


initThumbs([
	"./img/thumb1.jpg",
	"./img/thumb2.jpg",
	"./img/thumb3.jpg",
	"./img/thumb4.jpg",
	"./img/thumb5.jpg",
	"./img/thumb6.jpg",
	"./img/thumb7.jpg",
	"./img/thumb8.jpg"
	// "./img/thumb9.jpg",
	// "./img/thumb10.jpg",
	// "./img/thumb11.jpg",
	// "./img/thumb12.jpg"
]);


// update TWEEN before start rendering
scene.preRender(function () {
    TWEEN.update();
});
