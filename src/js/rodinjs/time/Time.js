import {ErrorSingletonClass, ErrorBadValueParameter, ErrorProtectedFieldChange} from '../error/CustomErrors';

let instance = null;
let enforce = function () {
};

/**
 * Time class
 */
export class Time {
    constructor (e) {
        if (e !== enforce) {
            throw new ErrorSingletonClass();
        }

        let speed = 1;
        this.setSpeed = value => {
            if (isNaN(value) || value < 0) {
                throw new ErrorBadValueParameter();
            }

            this.msBeforeLastSpeedChange = this.now();
            this.lastSpeedChange = Date.now();
            speed = value;
        };

        this.getSpeed = () => {
            return speed;
        };

        let delta = 0;
        this.setDelta = (value, e) => {
            if(e !== enforce) {
                throw new ErrorProtectedFieldChange('delta');
            }

            delta = value;
        };

        this.deltaTime = () => {
            return delta;
        };

        this.lastTeak = 0;
        this.msBeforeLastSpeedChange = 0;
        this.lastSpeedChange = Date.now();
        this.startTime = Date.now();
    }

    set speed (value) {
        this.setSpeed(value);
    }

    get speed () {
        return this.getSpeed();
    }

    tick () {
        this.setDelta(this.now() - this.lastTeak, enforce);
        this.lastTeak = this.now();
    }

    now () {
        return (Date.now() - this.lastSpeedChange) * this.speed + this.msBeforeLastSpeedChange;
    }

    static getInstance () {
        if (!instance) {
            instance = new Time(enforce);
        }

        return instance;
    }
}
