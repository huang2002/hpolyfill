import { patchSome, Num } from "./utils";

patchSome(Num, {

    isNaN: function (value) {
        return value !== value;
    },

    isFinite: function (value) {
        return typeof value === 'number' && isFinite(value);
    }

});
