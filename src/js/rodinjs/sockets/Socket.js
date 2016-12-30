import SocketInterface from './SocketInterface';
import io from '../../vendor/socket.io/dist/socket.io.js';

let _socket;
/**
 * A socket connection class, see socket example.
 */
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