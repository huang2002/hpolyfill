import { patch, patchSome, check, pick, Arr, ArrProto, none } from "./utils";
import { ITER_SYM } from "./Symbol";

patchSome(Arr, {

    from: function (arrayLike) {

        check(arrayLike);

        var args = arguments,
            result = [],
            mapFn = args[1],
            thisArg = args[2];

        if (Arr.isArray(arrayLike)) {

            result = arrayLike.slice();

            if (mapFn) {
                result = result.map(function (element, i) {
                    return mapFn.call(thisArg, element, i);
                });
            }

        } else {

            var length = arrayLike.length;

            if (typeof length === 'number') {

                for (var i = 0; i < length; i++) {
                    result.push(mapFn ? mapFn.call(thisArg, arrayLike[i], i) : arrayLike[i]);
                }

            }

        }

        return result;

    },

    of: function () {
        return Arr.from(arguments);
    }

});

patchSome(ArrProto, {

    includes: function (element) {
        var length = this.length,
            ele;
        for (var i = pick(arguments[1], 0); i < length; i++) {
            ele = this[i];
            if (ele === element || ele !== ele && element !== element) {
                return true;
            }
        }
        return false;
    },

    find: function (predicate) {
        var args = arguments,
            length = this.length;
        for (var i = pick(args[1], 0); i < length; i++) {
            if (predicate.call(args[1], this[i], this)) {
                return this[i];
            }
        }
    },

    findIndex: function (predicate) {
        var args = arguments,
            length = this.length;
        for (var i = pick(args[1], 0); i < length; i++) {
            if (predicate.call(args[1], this[i], this)) {
                return i;
            }
        }
        return -1;
    },

    fill: function (value) {

        var args = arguments,
            end = pick(args[2], this.length);

        for (var i = pick(args[1], 0); i < end; i++) {
            this[i] = value;
        }

        return this;

    },

    flat: function () {

        var result = [],
            source = this,
            depth = pick(arguments[0], 1);

        var noArrays;

        for (var i = 0; i < depth; i++) {

            noArrays = true;

            source.forEach(function (element) {
                if (Arr.isArray(element)) {
                    noArrays = false;
                    element.forEach(function (ele) {
                        result.push(ele);
                    });
                } else {
                    result.push(element);
                }
            });

            if (noArrays) {
                break;
            }

            source = result;
            result = [];

        }

        return result;

    },

    flatMap: function (callback) {
        return this.map(callback, arguments[1]).flat();
    }

});

export var arrIter = function () {
    var index = 0,
        self = this;
    return {
        next: function () {
            return index < self.length ?
                { value: self[index++], done: false } :
                { value: none, done: true };
        }
    };
};

patch(ArrProto, ITER_SYM, arrIter);
