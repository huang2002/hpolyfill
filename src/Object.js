import { patchSome, check, _Object, _Array, PROTOTYPE, isType } from "./utils";

var _hasOwnProperty = _Object[PROTOTYPE].hasOwnProperty;

patchSome(_Object, {

    assign: function (target, source) {

        check(target);

        target = _Object(target);

        _Array.from(arguments).forEach(function (src, i) {

            if (i === 0 || !src || !isType(src, 'object')) {
                return;
            }

            _Object.keys(src).forEach(function (key) {
                target[key] = src[key];
            });

        });

        return target;

    },

    is: function (value1, value2) {
        return value1 === value2 ?
            value1 !== 0 || 1 / value1 === 1 / value2 :
            value1 !== value1 && value2 !== value2;
    },

    keys: function (object) {
        check(object);
        var result = [];
        for (var key in object) {
            if (_hasOwnProperty.call(object, key)) {
                result.push(key);
            }
        }
        return result;
    },

    values: function (object) {
        check(object);
        return _Object.keys(object).map(function (key) {
            return object[key];
        });
    },

    entries: function (object) {
        check(object);
        return _Object.keys(object).map(function (key) {
            return [key, object[key]];
        });
    }

});


