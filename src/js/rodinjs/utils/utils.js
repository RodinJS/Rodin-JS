import * as utils3D from "./3Dutils.js";
import './Math.js';

!Array.prototype.last && (Array.prototype.last = function () {
    return this[this.length - 1]
});

export {utils3D};