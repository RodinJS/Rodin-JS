import {ErrorSingletonClass} from '../../error/CustomErrors';

const enforce = function () {
};

let instance = null;

export class CardboardGamePad {
    constructor(e) {
        if (e !== enforce) {
            throw new ErrorSingletonClass();
        }

        this.axes = [0, 0];
        this.buttons = [
            {
                pressed: false,
                touched: false,
                value: 0
            }
        ];

        this.connected = true;
        this.displayId = 0;
        this.hand = "";
        this.id = "Cardboard Gamepad";
        this.stopPropagationOnCardboardDown = false;
        this.stopPropagationOnCardboardMove = false;
        this.stopPropagationOnCardboardUp = false;


        let cardboardDown = (event) => {
            switch (event.button) {
                case 0:
                    this.buttons[0].pressed = true;
                    break;
                default:
                    break;
            }
            if (this.stopPropagationOnCardboardDown) {
                event.stopPropagation();
            }
        };

        let cardboardUp = (event) => {
            switch (event.button) {
                case 0:
                    this.buttons[0].pressed = false;
                    break;
                default:
                    break;
            }
            if (this.stopPropagationOnCardboardUp) {
                event.stopPropagation();
            }
        };

        document.body.addEventListener('touchstart', cardboardDown, false);
        document.body.addEventListener('touchend', cardboardUp, false);
    }

    static getInstance() {
        if (!instance) {
            instance = new CardboardGamePad(enforce);
        }

        return instance;
    }
}


