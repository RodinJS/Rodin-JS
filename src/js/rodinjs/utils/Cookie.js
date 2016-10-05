import {ErrorAbstractClassInstance} from '../error/CustomErrors.js';

class Cookie {
    constructor() {
        //todo "new.target" issue
/*        if (new.target === Cookie) {
            throw new ErrorAbstractClassInstance();
        }*/
    }

    static getCookies() {
        let c = document.cookie;
        let v = 0;
        let cookies = {};
        if (document.cookie.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
            c = RegExp.$1;
            v = 1;
        }
        if (v === 0) {
            c.split(/[,;]/).map(function (cookie) {
                let parts = cookie.split(/=/, 2);
                let name = decodeURIComponent(parts[0].trimLeft());
                cookies[name] = parts.length > 1 ? decodeURIComponent(parts[1].trimRight()) : null;
            });
        } else {
            c.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g).map(function (name, $1) {
                cookies[name] = $1.charAt(0) === '"' ? $1.substr(1, -1).replace(/\\(.)/g, "$1") : $1;
            });
        }
        return cookies;
    }

    static getCookie(name = "") {
        return this.getCookies()[name];
    }

    static setCookie(name = "", value = "", exdays = 1) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = name + "=" + value + "; " + expires;
    }
}

export default Cookie;