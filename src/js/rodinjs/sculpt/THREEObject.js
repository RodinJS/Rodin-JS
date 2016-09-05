import { Sculpt } from './Sculpt.js';
import { timeout } from '../utils/timeout.js';
import { Event } from '../Event.js';
import { ErrorNoObjectProvided } from '../error/CustomErrors.js';

export class THREEObject extends Sculpt {
    constructor(threeObject) {
        if(!threeObject) {
            throw new ErrorNoObjectProvided();
        }
        super();
        this.init(threeObject);
        timeout(() => {
            this.emit('ready', new Event(this));
        })
    }
}