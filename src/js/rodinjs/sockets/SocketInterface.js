import {ErrorAbstractClassInstance} from '../error/CustomErrors.js';

class SocketInterface {
    constructor(channel = "", room = "") {
        if (new.target === SocketInterface) {
            throw new ErrorAbstractClassInstance();
        }
        this.channel = channel;
        this.room = room;
    }

    on(eventName, callback) {};

    emit(eventName, data, callback) {};

}

export default SocketInterface;