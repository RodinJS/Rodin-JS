import {ErrorSingletonClass} from '../../error/CustomErrors';

const enforce = function () {
};

let instance = null;

export class CardboardGamePad {
    /**
     * Constructor - only for inherited classes
     */
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
        this.stopPropagationOnMouseDown = false;
        this.stopPropagationOnMouseUp = false;


        let cardboardDown = () => {
            this.buttons[0].pressed = true;
            if (this.stopPropagationOnMouseDown) {
                event.stopPropagation();
            }
        };

        let cardboardUp = () => {
            this.buttons[0].pressed = false;
            if (this.stopPropagationOnMouseUp) {
                event.stopPropagation();
            }
        };

        document.body.addEventListener('touchstart', cardboardDown, false);
        document.body.addEventListener('touchend', cardboardUp, false);
        document.body.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        }, false);
    }

    static getInstance() {
        if (!instance) {
            instance = new CardboardGamePad(enforce);
        }

        return instance;
    }
}


