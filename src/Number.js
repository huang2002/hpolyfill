import { patchSome } from "./utils";

patchSome(Number, {

    isNaN: function (value) {
        return value !== value;
    },

    isFinite: function (value) {
        return typeof value === 'number' && isFinite(value);
    }

});
