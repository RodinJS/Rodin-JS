export class Timeout {
    constructor(cb, delay, autorun) {
        this.timer = null;
        this.run = false;
        this.cb = cb;
        this.delay = delay;

        if(autorun) {
            this.startTimer();
        }
    }

    startTimer() {
        this.timer = setTimeout(() => {
            if(this.run) {
                this.cb();
            }
            clearTimeout(this.timer);
            this.startTimer();
        }, this.delay);
    }

    start() {
        this.run = true;
    }

    stop() {
        this.run = false;
    }

    isRunning() {
        return this.run;
    }
}
