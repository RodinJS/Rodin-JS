class CustomError extends Error {
    constructor(message) {
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
    constructor() {
        super("Cant make instance of abstract class");
    }
}

export class ErrorInvalidUrl extends CustomError {
    constructor(filed) {
        super(`Invalid URL for ${filed}`);
    }
}