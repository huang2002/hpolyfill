import { test, patch, createClass, checkThis } from "./utils";

test(window, 'Map', function (Map) {
    var map = new Map([[-0, 1], [+0, 1]]);
    return typeof map.forEach === 'function' && map.size === 1 && map.set(1, 2) === map;
});

patch(window, 'Map', createClass(
    function Map() {
        checkThis(this, Map);

        this._keys = [];
        this._values = [];

        if (arguments[0]) {
            Array.from(arguments[0]).forEach(function (element) {
                if (Array.isArray(element)) {
                    this.set(element[0], element[1]);
                }
            }, this);
        }

    }, {

        _indexOf: {
            value: function (key) {
                if (Object.is(key, -0)) {
                    key = +0;
                }
                return this._keys.findIndex(function (ele) {
                    return Object.is(ele, key);
                });
            }
        },

        size: {
            get: function () {
                return this._keys.length;
            }
        },

        has: {
            value: function (key) {
                return this._indexOf(key) >= 0;
            }
        },

        get: {
            value: function (key) {
                var index = this._indexOf(key);
                return index >= 0 ? this._values[index] : undefined;
            }
        },

        set: {
            value: function (key, value) {

                if (Object.is(key, -0)) {
                    key = +0;
                }

                var index = this._indexOf(key);

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
                var index = this._indexOf(key);
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

    }
));

