import {ErrorAbstractClassInstance, ErrorParameterTypeDontMatch} from '../error/CustomErrors.js';

export class Manager {
    constructor(COSTRUCTOR) {
        if (this.constructor === Manager) {
            throw new ErrorAbstractClassInstance();
        }

        this._items = {};
        this._active = null;
        this._COSTRUCTOR = COSTRUCTOR;
    }

    create() {
        const item = new this._COSTRUCTOR(...arguments);
        let keys = Object.keys(this._items);
        const index = (parseInt(keys[keys.length - 1]) || 0) + 1;
        this._items[index] = item;
        item._MANAGER_INDEX = index;

        return item;
    }

    add(item) {
        if (!(item instanceof this._COSTRUCTOR)) {
            throw new ErrorParameterTypeDontMatch('item', this._COSTRUCTOR.toString());
        }
    }

    get(index = this._active) {
        if (index == null) {
            throw new ErrorParameterTypeDontMatch();
        }

        if (index instanceof this._COSTRUCTOR) {
            index = index._MANAGER_INDEX;
        }

        return this._items[index];
    }
}
