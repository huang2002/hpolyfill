import { test, patch, createClass, checkThis, _window, _Array, _undefined, isFn, _Object, PROTOTYPE } from "./utils";
import { SYMBOL_ITERATOR } from "./Symbol";

test(_window, 'Map', function (Map) {
    var map = new Map([[-0, 1], [+0, 1]]);
    return isFn(map.forEach) && isFn(map[SYMBOL_ITERATOR]) && map.size === 1 && map.set(1, 2) === map;
});

var _Map = patch(_window, 'Map', createClass(
    function Map() {
        checkThis(this, Map);

        this._keys = [];
        this._values = [];

        var pairs = arguments[0];
        if (pairs) {
            _Array.from(pairs).forEach(function (element) {
                if (_Array.isArray(element)) {
                    this.set(element[0], element[1]);
                }
            }, this);
        }

    }, {

        size: {
            get: function () {
                return this._keys.length;
            }
        },

        has: function (key) {
            return this._keys.includes(key);
        },

        get: function (key) {
            var index = this._keys.indexOf(key);
            return ~index ? this._values[index] : _undefined;
        },

        set: function (key, value) {

            if (_Object.is(key, -0)) {
                key = +0;
            }

            var index = this._keys.indexOf(key);

            if (~index) {
                this._values[index] = value;
            } else {
                this._keys.push(key);
                this._values.push(value);
            }

            return this;

        },

        delete: function (key) {
            var index = this._keys.indexOf(key);
            if (!~index) {
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
            }
            return this;
        },

        forEach: function (callback) {
            var values = this._values;
            this._keys.forEach(function (key, i) {
                callback(values[i], key, this);
            }, this);
        },

        clear: function () {
            this._keys.length = this._values.length = 0;
        }

    }
));

patch(_Map[PROTOTYPE], SYMBOL_ITERATOR, function () {
    var pairs = [];
    this.forEach(function (value, key) {
        pairs.push([key, value]);
    });
    return pairs[SYMBOL_ITERATOR]();
});
