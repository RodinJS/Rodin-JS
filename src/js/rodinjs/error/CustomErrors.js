class CustomError extends Error {
    constructor (message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

export class ErrorAbstractClassInstance extends CustomError {
    constructor () {
        super("Cant make instance of abstract class");
    }
}

export class ErrorSingletonClass extends CustomError {
    constructor () {
        super("Instantiation failed. Use .getInstance() method instead of new");
    }
}

export class ErrorInvalidUrl extends CustomError {
    constructor (filed) {
        super(`Invalid URL for ${filed}`);
    }
}

export class ErrorMAPClassInstance extends CustomError {
    constructor () {
        super(`Error making instance of MAP class, use static fields`);
    }
}

export class ErrorNoSceneProvided extends CustomError {
    constructor () {
        super(`Error no scene provided, use setScene method before raycastiong`);
    }
}

export class ErrorNoObjectProvided extends CustomError {
    constructor () {
        super(`Error no THREEJS object provided`);
    }
}

export class ErrorNoValueProvided extends CustomError {
    constructor (field) {
        super(`Error no ${field} provided`);
    }
}

export class ErrorMouseControllerAlreadyExists extends CustomError {
    constructor () {
        super(`Error Mouse controller already exists`);
    }
}

export class ErrorCardboardControllerAlreadyExists extends CustomError {
    constructor () {
        super(`Error Cardboard controller already exists`);
    }
}

export class ErrorViveControllerAlreadyExists extends CustomError {
    constructor (hand) {
        super(`Error Vive controller already exists for ${hand} hand`);
    }
}

export class ErrorOculusControllerAlreadyExists extends CustomError {
    constructor () {
        super(`Error Oculus controller already exists`)
    }
}

export class ErrorInvalidFileFormat extends CustomError {
    constructor () {
        super(`Invalid URL for ${filed}`)
    }
}

export class ErrorBadValueParameter extends CustomError {
    constructor () {
        super('Bad argument');
    }
}

export class ErrorProtectedFieldChange extends CustomError {
    constructor (field = '') {
        super(`Protected field ${field} can not be changed`);
    }
}

export class ErrorInvalidEventType extends CustomError {
    constructor (eventName = '', action = '') {
        super(`Invalid event name ${eventName} for action ${action}`);
    }
}

export class ErrorParameterTypeDontMatch extends CustomError {
    constructor (paramName = '', type = '') {
        super(`Parameter ${paramName} must be in type ${type}`);
    }
}
