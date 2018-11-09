import { test, patch, createClass, checkThis, findIndex, win, Arr, none, isFn } from "./utils";
import { ITER_SYM } from "./Symbol";

test(win, 'Map', function (Map) {
    var map = new Map([[-0, 1], [+0, 1]]);
    return isFn(map.forEach) && map.size === 1 && map.set(1, 2) === map && isFn(map[ITER_SYM]);
});

var MapProto = {

    size: {
        get: function () {
            return this._keys.length;
        }
    },

    has: {
        value: function (key) {
            return findIndex(this._keys, key) >= 0;
        }
    },

    get: {
        value: function (key) {
            var index = findIndex(this._keys, key);
            return index >= 0 ? this._values[index] : none;
        }
    },

    set: {
        value: function (key, value) {

            if (Object.is(key, -0)) {
                key = +0;
            }

            var index = findIndex(this._keys, key);

            if (index >= 0) {
                this._values[index] = value;
            } else {
                this._keys.push(key);
                this._values.push(value);
            }

            return this;

        }
    },

    delete: {
        value: function (key) {
            var index = findIndex(this._keys, key);
            if (index >= 0) {
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
            }
            return this;
        }
    },

    forEach: {
        value: function (callback) {
            var values = this._values;
            this._keys.forEach(function (key, i) {
                callback(values[i], key, this);
            }, this);
        }
    },

    clear: {
        value: function () {
            this._keys.length = this._values.length = 0;
        }
    }

};

MapProto[ITER_SYM] = {
    value: function () {
        var index = -1,
            keys = this._keys,
            values = this._values,
            size = keys.length;
        return {
            next: function () {
                return ++index < size ?
                    { value: [keys[index], values[index]], done: false } :
                    { value: none, done: true };
            }
        };
    }
};

patch(win, 'Map', createClass(
    function Map() {
        checkThis(this, Map);

        this._keys = [];
        this._values = [];

        var pairs = arguments[0];
        if (pairs) {
            Arr.from(pairs).forEach(function (element) {
                if (Arr.isArray(element)) {
                    this.set(element[0], element[1]);
                }
            }, this);
        }

    },
    MapProto
));

