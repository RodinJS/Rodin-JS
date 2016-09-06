'use strict';

export class Event {
	/**
	 * Event Class
	 * @param {Sculpt} target
	 * @param {DOMEvent} domEvent
	 * @param keyCode
	 * @constructor
	 */
	constructor (target, domEvent = null, keyCode = null) {
	    this.target = target;
	    this.domEvent = domEvent;
		this.keyCode = keyCode;

		this.timeStamp = Date.now();
	}
}