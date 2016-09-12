import SocketInterface from './SocketInterface';
import io from 'socket.io-client';
import Cookie from '../utils/Cookie.js';

let params = {query: "fake-access-token=" + Cookie.getCookie("token")};
//localStorage.debug = '*';

const socket = io.connect('', params);

class Socket extends SocketInterface{
    constructor(channel = "", room = "") {
        super(channel, room);

        this.emit("subscribe", {
            channel: this.channel,
            room: this.room
        });
    }

    on(eventName, callback) {
        socket.on(eventName, function () {
            if (callback) {
                callback.apply(socket, arguments);
            }
        });
    };

    emit(eventName, data, callback) {
        socket.emit(eventName, data, ()=> {
            if (callback) {
                callback.apply(socket, arguments);
            }
        })
    };


}

export default Socket;