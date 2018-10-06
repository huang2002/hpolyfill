import { patchSome, check, pick } from "./utils";

patchSome(Array, {

    from: function (arrayLike) {

        check(arrayLike);

        var result = [],
            mapFn = arguments[1],
            thisArg = arguments[2];

        if (Array.isArray(arrayLike)) {

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
        return Array.from(arguments);
    }

});

patchSome(Array.prototype, {

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
        var length = this.length;
        for (var i = pick(arguments[1], 0); i < length; i++) {
            if (predicate.call(arguments[1], this[i], this)) {
                return this[i];
            }
        }
    },

    findIndex: function (predicate) {
        var length = this.length;
        for (var i = pick(arguments[1], 0); i < length; i++) {
            if (predicate.call(arguments[1], this[i], this)) {
                return i;
            }
        }
        return -1;
    },

    fill: function (value) {

        var end = pick(arguments[2], this.length);

        for (var i = pick(arguments[1], 0); i < end; i++) {
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
                if (Array.isArray(element)) {
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
