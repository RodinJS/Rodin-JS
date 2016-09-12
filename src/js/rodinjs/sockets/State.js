import SocketInterface from './SocketInterface';
import Socket from './Socket';

class State extends SocketInterface {
    constructor(room = "") {

        super("space", room);

        this.socket = new Socket({
            room: this.room,
            channel: this.channel
        });

    }


    on(eventName, callback) {
        this.socket.on(eventName, function (data) {
            if (data.channel == this.channel) {
                var cleanData = data.data;

                // cleanData.isSelf = (cleanData.actionUser == user.id);

                callback.apply(this, [cleanData]);
            }
        });
    };

    emit(eventName, data, callback) {
        var emittedData = {
            channel: this.channel,
            room: this.room,
            data: {
                action: eventName,
                body: data
            }
        };
        this.socket.emit("event", emittedData, function (data) {
            if (data.channel == this.channel) {
                callback.apply(this, [data.data]);
            }
        });
    };
}

export default State;