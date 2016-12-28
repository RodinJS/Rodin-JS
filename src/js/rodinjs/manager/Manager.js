import {ErrorAbstractClassInstance, ErrorParameterTypeDontMatch} from '../error/CustomErrors.js';

/**
 * Abstract Manager Class
 * @param {Class} COSTRUCTOR - the class of object you are going to manage in the inherited Manager class. (see SceneManager)
 */
export class Manager {
    constructor(COSTRUCTOR) {
        if (this.constructor === Manager) {
            throw new ErrorAbstractClassInstance();
        }

        this._items = {};
        this._active = null;
        this._COSTRUCTOR = COSTRUCTOR;
    }

    /**
     * Create new Instance of the managed Class
     * @returns {*} created instance
     */
    create() {
        const item = new this._COSTRUCTOR(...arguments);
        let keys = Object.keys(this._items);
        const index = (parseInt(keys[keys.length - 1]) || 0) + 1;
        this._items[index] = item;
        item._MANAGER_INDEX = index;

        return item;
    }

    /**
     * Add new Instance of the managed Class to the manager
     * @param item {*} added instance
     */
    add(item) {
        if (!(item instanceof this._COSTRUCTOR)) {
            throw new ErrorParameterTypeDontMatch('item', this._COSTRUCTOR.toString());
        }
    }

    //TODO: Gor mi hat nayi eli es indexy inch tip kara lini u incha inqy voobshe
    /**
     * Get instance of the managed Class
     * @param {*} index
     * @returns {*}
     */
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
