import SocketInterface from './SocketInterface';
import io from '../../vendor/socket.io/socket.io.js';

let _socket;

export class Socket extends SocketInterface {
    constructor(url = "//ws.rodin.space/", params = {
        transports: ['websocket', 'polling']
    }) {
        super();

        if (!_socket) {
            _socket = io.connect(url, params);
        }
    }

    on() {
        _socket.on(...arguments);
    };

    emit() {
        _socket.emit(...arguments);
    };


}