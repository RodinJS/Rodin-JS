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
            },
            {
                pressed: false,
                touched: false,
                value: 0
            },
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

        let cardboardMove = (event) => {
            this.axes[0] = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.axes[1] = -( event.clientY / window.innerHeight ) * 2 + 1;


            if (this.stopPropagationOnCardboardMove) {
                event.stopPropagation();
            }
        };

        let cardboardDown = (event) => {
            switch (event.button) {
                case 0:
                    this.buttons[0].pressed = true;
                    break;
                case 1:
                    this.buttons[1].pressed = true;
                    break;
                case 2:
                    this.buttons[2].pressed = true;
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
                case 1:
                    this.buttons[1].pressed = false;
                    break;
                case 2:
                    this.buttons[2].pressed = false;
                    break;
                default:
                    break;
            }
            if (this.stopPropagationOnCardboardUp) {
                event.stopPropagation();
            }
        };

        document.body.addEventListener('mousemove', cardboardMove, false);
        document.body.addEventListener('mousedown', cardboardDown, false);
        document.body.addEventListener('mouseup', cardboardUp, false);
    }

    static getInstance() {
        if (!instance) {
            instance = new CardboardGamePad(enforce);
        }

        return instance;
    }
}


