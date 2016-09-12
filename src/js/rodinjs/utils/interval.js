export class Interval {
    /**
     *
     * @param {Function} cb
     * @param {number} delay
     * @param {boolean} autorun
     */
    constructor(cb = function () {
    }, delay = 1000, autorun = false) {
        this.timer = null;
        this.run = false;
        this.cb = cb;
        this.delay = delay;

        if (autorun) {
            this.start();
        }
    }

    startTimer() {
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            if (this.run) {
                this.cb();
            } else {
                return;
            }
            this.startTimer();
        }, this.delay);
    }

    /**
     * Start timer
     */
    start() {
        if (this.run) {
            console.warn("Timer already is running!");
        } else {
            this.run = true;
            this.startTimer();
        }
    }

    /**
     * Stop timer
     */
    stop() {
        this.run = false;
    }

    get running() {
        return this.run;
    }
}