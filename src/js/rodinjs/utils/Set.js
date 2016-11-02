export class Set extends Array {
    constructor () {
        super(...arguments);
    }

    push (item) {
        if(this.indexOf(item) !== -1) {
            super.push(item);
        } else {
            return new Error('Item already exists');
        }
    }
}