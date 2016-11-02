import {ErrorSingletonClass} from '../error/CustomErrors';

let instance = null;
let enforce = function () {
};

export class Time {
    constructor (e) {
        if (e !== enforce) {
            throw new ErrorSingletonClass();
        }

        this.speed = 1;
        this.delta = 0;
        this.lastTeak = 0;
    }

    deltaTime(ignoreSpeed = false) {
        return this.delta * (ignoreSpeed ? 1 : this.speed);
    }

    tick() {
        this.delta = Date.now() - this.lastTeak;
        this.lastTeak = Date.now();
    }

    static getInstance () {
        if (!instance) {
            instance = new Time(enforce);
        }

        return instance;
    }
}
