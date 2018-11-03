import { patchSome, check, Obj, Arr } from "./utils";

patchSome(Obj, {

    assign: function (target, source) {

        check(target);

        target = Obj(target);

        Arr.from(arguments).forEach(function (src, i) {

            if (i === 0) {
                return;
            }

            Object.keys(src).forEach(function (key) {
                target[key] = src[key];
            });

        });

        return target;

    },

    is: function (value1, value2) {
        if (value1 === value2) {
            return value1 !== 0 || 1 / value1 === 1 / value2;
        } else {
            return value1 !== value1 && value2 !== value2;
        }
    },

    keys: function (object) {
        var result = [];
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                result.push(key);
            }
        }
        return result;
    },

    values: function (object) {
        return Object.keys(object).map(function (key) {
            return object[key];
        });
    },

    entries: function (object) {
        return Object.keys(object).map(function (key) {
            return [key, object[key]];
        });
    }

});


