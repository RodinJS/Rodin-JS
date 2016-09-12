class State extends Socket {
    constructor() {

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

export default State;