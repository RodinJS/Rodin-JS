'use strict';

export class RodinEvent {
	/**
	 * Event Class
	 * @param {Sculpt} target
	 * @param {event} domEvent
	 * @param keyCode
	 * @param {string} hand
	 * @param {GamePad} controller
	 * @constructor
	 */
	constructor (target, domEvent = null, keyCode = null, hand = "", controller = null) {
	    this.target = target;
	    this.domEvent = domEvent;
		this.keyCode = keyCode;
		this.hand =  hand;
		this.controller = controller;
		this.name = 'event';

		this.keys = [];

		this.timeStamp = Date.now();
		this.propagation = true;
	}

    /**
	 * getKey function.
     * @param keyCode {number}
     * @returns {boolean} true if controller key is pressed, false otherwise
     */
	getKey(keyCode) {
		return this.keys.indexOf(keyCode) !== -1
    }

    stopPropagation() {
		this.propagation = false;
	}
}