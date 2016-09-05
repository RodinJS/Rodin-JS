import { Sculpt } from './Sculpt.js';
import { ErrorNoObjectProvided } from '../error/CustomErrors.js';

export class THREEObject extends Sculpt {
    constructor(threeObject) {
        if(!threeObject) {
            throw new ErrorNoObjectProvided();
        }
        super();
        this.init(threeObject);
    }
}