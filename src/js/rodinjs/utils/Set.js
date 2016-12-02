let oldPush = Array.prototype.push;

export class Set extends Array {
    constructor () {
        super(...arguments);

        this.push = function (item) {
            if(this.indexOf(item) === -1) {
                if(this.validate) {
                    item = this.validate(item);
                }
                oldPush.call(this, item);
            } else {
                return new Error('Item already exists');
            }
        }
    }
}

