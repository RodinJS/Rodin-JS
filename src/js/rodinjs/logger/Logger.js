import {env_mode} from "../constants/constants.js";

export class WTF {
    /**
     * throw error
     */
    constructor() {
        throw new Error("Cannot create object, use static methods");
    };


    static is() {
        if(env_mode === "development") {
            console.log.apply(console, arguments);
        }
    }

    static warn() {
        if(env_mode === "development") {
            console.warn.apply(console, arguments);
        }
    }

    static log() {
        WTF.is.apply(null, params);
    }
}
