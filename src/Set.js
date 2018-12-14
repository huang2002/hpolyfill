import { test, patch, createClass, checkThis, Arr, Obj, isFn, win } from "./utils";
import { ITER_SYM } from "./Symbol";

test(win, 'Set', function (Set) {
    var set = new Set([-0, +0]);
    return isFn(set.forEach) && set.size === 1 && set.add(1) === set && isFn(set[ITER_SYM]);
});

var SetProto = {

    size: {
        get: function () {
            return this._values.length;
        }
    },

    has: {
        value: function (element) {
            return this._values.includes(element);
        }
    },

    add: {
        value: function (element) {

            if (Obj.is(element, -0)) {
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
            var index = this._values.indexOf(element);
            if (!~index) {
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

};

SetProto[ITER_SYM] = {
    value: function () {
        return this._values[ITER_SYM]();
    }
};

patch(win, 'Set', createClass(
    function Set() {
        checkThis(this, Set);

        this._values = [];

        var values = arguments[0];
        if (values) {
            Arr.from(values).forEach(function (element) {
                this.add(element);
            }, this);
        }

    },
    SetProto
));
