import { patch, patchSome, check, pick, _Array, _ArrayPrototype, _undefined, test, _Object, _NaN, isFn, isType } from "./utils";
import { SYMBOL_ITERATOR } from "./Symbol";

patchSome(_Array, {

    from: function (arrayLike) {

        check(arrayLike);

        var args = arguments,
            result = [],
            mapFn = args[1],
            thisArg = args[2];

        if (_Array.isArray(arrayLike)) {

            result = arrayLike.slice();

            if (mapFn) {
                result = result.map(function (element, i) {
                    return mapFn.call(thisArg, element, i);
                });
            }

        } else if (isFn(arrayLike[SYMBOL_ITERATOR])) {

            var next = arrayLike[SYMBOL_ITERATOR]().next,
                iterResult;

            while (!(iterResult = next()).done) {
                result.push(iterResult.value);
            }

        } else {

            var length = arrayLike.length;

            if (isType(length, 'number')) {
                for (var i = 0; i < length; i++) {
                    result.push(mapFn ? mapFn.call(thisArg, arrayLike[i], i) : arrayLike[i]);
                }
            }

        }

        return result;

    },

    of: function () {
        return _Array.from(arguments);
    }

});

export var arrayIterator = function () {
    var index = 0,
        self = this;
    return {
        next: function () {
            return index < self.length ?
                { value: self[index++], done: false } :
                { value: _undefined, done: true };
        }
    };
};

patchSome(_ArrayPrototype, {

    includes: function (element) {
        var start = arguments[1] || 0,
            elementIsNaN = element !== element;
        return !!~this.findIndex(function (ele, i) {
            return i >= start && (ele === element || elementIsNaN && ele !== ele);
        });
    },

    find: function (predicate) {
        var thisArg = arguments[1],
            length = this.length;
        for (var i = 0; i < length; i++) {
            if (predicate.call(thisArg, this[i], i, this)) {
                return this[i];
            }
        }
    },

    findIndex: function (predicate) {
        var thisArg = arguments[1],
            length = this.length;
        for (var i = 0; i < length; i++) {
            if (predicate.call(thisArg, this[i], i, this)) {
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

        var result,
            source = this,
            depth = pick(arguments[0], 1);

        var noArrays;

        for (var i = 0; i < depth; i++) {

            result = [];
            noArrays = true;

            source.forEach(function (element) {
                if (_Array.isArray(element)) {
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

        }

        return result;

    },

    flatMap: function (callback) {
        return this.map(callback, arguments[1]).flat();
    },

    keys: function () {
        var self = this,
            index = 0;
        return {
            next: function () {
                return index < self.length ?
                    { value: index++, done: false } :
                    { value: _undefined, done: true };
            }
        };
    },

    values: arrayIterator,

    entries: function () {
        var self = this,
            index = -1;
        return {
            next: function () {
                return ++index < self.length ?
                    { value: [index, self[index]], done: false } :
                    { value: _undefined, done: true };
            }
        };
    }

});

patch(_ArrayPrototype, SYMBOL_ITERATOR, arrayIterator);
