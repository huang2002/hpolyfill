import { test, patch, createClass, checkThis, _Array, _Object, isFn, _window, PROTOTYPE } from "./utils";
import { SYMBOL_ITERATOR } from "./Symbol";

test(_window, 'Set', function (Set) {
    var set = new Set([-0, +0]);
    return isFn(set.forEach) && isFn(set[SYMBOL_ITERATOR]) && set.size === 1 && set.add(1) === set;
});

patch(_window, 'Set', createClass(
    function Set() {
        checkThis(this, Set);

        this._values = [];

        var values = arguments[0];
        if (values) {
            _Array.from(values).forEach(function (element) {
                this.add(element);
            }, this);
        }

    }, {

        size: {
            get: function () {
                return this._values.length;
            }
        },

        has: function (element) {
            return this._values.includes(element);
        },

        add: function (element) {

            if (_Object.is(element, -0)) {
                element = +0;
            }

            if (!this._values.includes(element)) {
                this._values.push(element);
            }

            return this;

        },

        delete: function (element) {
            var index = this._values.indexOf(element);
            if (!~index) {
                this._values.splice(index, 1);
            }
            return this;
        },

        forEach: function (callback) {
            this._values.forEach(function (element) {
                callback(element, element, this);
            }, this);
        },

        clear: function () {
            this._values.length = 0;
        }

    }
));

patch(_window.Set[PROTOTYPE], SYMBOL_ITERATOR, function () {
    var values = [];
    this.forEach(function (value) {
        values.push(value);
    });
    return values[SYMBOL_ITERATOR]();
});
