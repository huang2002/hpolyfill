import { test, patch, createClass, checkThis } from "./utils";

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

        _indexOf: {
            value: function (element) {
                if (Object.is(element, -0)) {
                    element = +0;
                }
                return this._values.findIndex(function (ele) {
                    return Object.is(ele, element);
                });
            }
        },

        size: {
            get: function () {
                return this._values.length;
            }
        },

        has: {
            value: function (element) {
                return this._indexOf(element) >= 0;
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
                var index = this._indexOf(element);
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
