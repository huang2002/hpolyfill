import { test, patch, createClass, checkThis, findIndex } from "./utils";

test(window, 'Set', function (Set) {
    var set = new Set([-0, +0]);
    return typeof set.forEach === 'function' && set.size === 1 && set.add(1) === set;
});

patch(window, 'Set', createClass(
    function Set() {
        checkThis(this, Set);

        this._values = [];

        if (arguments[0]) {
            Array.from(arguments[0]).forEach(function (element) {
                this.add(element);
            }, this);
        }

    }, {

        size: {
            get: function () {
                return this._values.length;
            }
        },

        has: {
            value: function (element) {
                return findIndex(this._values, element) >= 0;
            }
        },

        add: {
            value: function (element) {

                if (Object.is(element, -0)) {
                    element = +0;
                }

                if (!this._values.includes(element)) {
                    this._values.push(element);
                }

                return this;

            }
        },

        delete: {
            value: function (element) {
                var index = findIndex(this._values, element);
                if (index >= 0) {
                    this._values.splice(index, 1);
                }
                return this;
            }
        },

        forEach: {
            value: function (callback) {
                this._values.forEach(function (element) {
                    callback(element, element, this);
                }, this);
            }
        },

        clear: {
            value: function () {
                this._values.length = 0;
            }
        }

    }
));
