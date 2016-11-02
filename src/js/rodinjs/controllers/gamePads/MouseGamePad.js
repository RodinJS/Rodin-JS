export class MouseGamePad {
    constructor() {
        this.axes = [0,0];
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

        this.mouseMove = (event) => {
            this.axes[0] = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.axes[1] = - ( event.clientY / window.innerHeight ) * 2 + 1;


            if ( this.stopPropagationOnMouseMove ) {
                event.stopPropagation();
            }
        };
        this.mouseDown = (event) => {
            switch(event.button) {
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
            if ( this.stopPropagationOnMouseDown ) {
                event.stopPropagation();
            }
        };
        this.mouseUp = (event) => {
            switch(event.button) {
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
            if ( this.stopPropagationOnMouseUp ) {
                event.stopPropagation();
            }
        };
        document.body.addEventListener( 'mousemove', this.mouseMove, false );
        document.body.addEventListener( 'mousedown', this.mouseDown, false );
        document.body.addEventListener( 'mouseup', this.mouseUp, false );
        document.body.addEventListener( 'contextmenu', (e) => {e.preventDefault();return;}, false );
    }
}


