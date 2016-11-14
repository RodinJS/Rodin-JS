import {ErrorSingletonClass} from '../../error/CustomErrors';

const enforce = function () {
};

let instance = null;

export class MouseGamePad {
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
        this.id = "Mouse Gamepad";
        this.stopPropagationOnMouseDown = false;
        this.stopPropagationOnMouseMove = false;
        this.stopPropagationOnMouseUp = false;
        this.stopPropagationOnScroll = false;

        let mouseMove = (event) => {
            this.axes[0] = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.axes[1] = -( event.clientY / window.innerHeight ) * 2 + 1;


            if (this.stopPropagationOnMouseMove) {
                event.stopPropagation();
            }
        };

        let mouseDown = (event) => {
            //console.log(event);
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
            if (this.stopPropagationOnMouseDown) {
                event.stopPropagation();
            }
        };

        let mouseUp = (event) => {
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
            if (this.stopPropagationOnMouseUp) {
                event.stopPropagation();
            }
        };

        let scroll = (event) => {
            this.buttons[1].value += event.deltaY;
            //console.log(this.buttons[1].value);
            if (this.stopPropagationOnScroll) {
                event.stopPropagation();
            }
        };

        document.body.addEventListener('mousemove', mouseMove, false);
        document.body.addEventListener('mousedown', mouseDown, false);
        document.body.addEventListener('mouseup', mouseUp, false);

        document.body.addEventListener('touchmove', (evt)=> {
            // console.log("evt", evt);
            evt.clientX = evt.touches[0].clientX;
            evt.clientY = evt.touches[0].clientY;
            mouseMove(evt);
        }, false);
        document.body.addEventListener('touchstart', (evt)=> {
            evt.button = 0;
            mouseDown(evt);
        }, false);
        document.body.addEventListener('touchend', (evt)=> {
            evt.button = 0;
            mouseUp(evt);
        }, false);

        document.body.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        }, false);
        document.body.addEventListener('wheel', scroll, false);
    }

    static getInstance() {
        if (!instance) {
            instance = new MouseGamePad(enforce);
        }

        return instance;
    }
}