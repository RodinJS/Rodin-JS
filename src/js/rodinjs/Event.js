'use strict';
export class Event {
	/**
	 * Event Class
	 * @param target
	 * @param {HTMLElement} domEvent
	 * @param {THREE.PerspectiveCamera} camera
	 * @param contols
	 * @param custormData
	 * @constructor
	 */
	constructor (target, domEvent, camera, contols, custormData) {
	    this.target = target;
	    this.domEvent = domEvent;
	    this.camera = camera;
	    this.controls = contols;
	    this.customData = custormData;
	}
}