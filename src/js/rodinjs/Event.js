'use strict';

export class Event {
	/**
	 * Event Class
	 * @param {Sculpt} target
	 * @param {DOMEvent} domEvent
	 * @constructor
	 */
	constructor (target, domEvent) {
	    this.target = target;
	    this.domEvent = domEvent;

		this.timeStamp = Date.now();
	}
}