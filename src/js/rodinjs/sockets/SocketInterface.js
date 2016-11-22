import {ErrorAbstractClassInstance} from '../error/CustomErrors.js';

class SocketInterface {
    constructor(channel = "", room = "") {
        //TODO: by Lyov "new.target" issue
/*        if (new.target === SocketInterface) {
            throw new ErrorAbstractClassInstance();
        }*/
        this.channel = channel;
        this.room = room;
    }

    on(eventName, callback) {};

    emit(eventName, data, callback) {};

}

export default SocketInterface;