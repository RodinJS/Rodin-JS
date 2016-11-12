'use strict';

export class Event {
	/**
	 * Event Class
	 * @param {Sculpt} target
	 * @param {event} domEvent
	 * @param keyCode
	 * @param {string} hand
	 * @constructor
	 */
	constructor (target, domEvent = null, keyCode = null, hand = "", controller = null) {
	    this.target = target;
	    this.domEvent = domEvent;
		this.keyCode = keyCode;
		this.hand =  hand;
		this.controller = controller;

		this.timeStamp = Date.now();
	}
}