import { patchSome, check, Obj, Arr } from "./utils";

patchSome(Obj, {

    assign: function (target, source) {

        check(target);

        target = Obj(target);

        Arr.from(arguments).forEach(function (src, i) {

            if (i === 0) {
                return;
            }

            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    target[key] = src[key];
                }
            }

        });

        return target;

    },

    is: function (value1, value2) {
        if (value1 === value2) {
            return value1 !== 0 || 1 / value1 === 1 / value2;
        } else {
            return value1 !== value1 && value2 !== value2;
        }
    }

});


