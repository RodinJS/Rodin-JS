Object.getProperty = function (obj, prop) {
    let props = prop.split('.');
    let tmp = obj;

    for (let i = 0; i < props.length; i++) {
        if (!tmp.hasOwnProperty(props[i])) {
            return;
        }

        tmp = tmp[props[i]];
    }

    return tmp;
};

Object.setProperty = function (obj, prop, val) {
    let props = prop.split('.');
    let tmp = obj;

    for (let i = 0; i < props.length - 1; i++) {
        if (!tmp.hasOwnProperty(props[i])) {
            tmp[props[i]] = {};
        }

        tmp = tmp[props[i]];
    }

    tmp[props[props.length - 1]] = val;
};

Object.clone = function (obj) {
    if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    let temp = null;
    if (obj instanceof Date)
        temp = new obj.constructor();
    else
        temp = obj.constructor();

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = Object.clone(obj[key]);
            delete obj['isActiveClone'];
        }
    }

    return temp;
};