export class Timeout {
    constructor(cb = function(){}, delay = 1000, autorun = false) {
        this.timer = null;
        this.run = false;
        this.cb = cb;
        this.delay = delay;

        if(autorun) {
            this.start();
        }
    }

    startTimer() {
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            if(this.run) {
                this.cb();
            }else{
                return;
            }
            this.startTimer();
        }, this.delay);
    }

    start() {
        if(this.run){
            console.warn("Timer already is running!");
        }else{
            this.run = true;
            this.startTimer();
        }
    }

    stop() {
        this.run = false;
    }

    isRunning() {
        return this.run;
    }
}