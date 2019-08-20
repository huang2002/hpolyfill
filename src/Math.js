import { patchSome, _Math } from "./utils";

patchSome(_Math, {

    sign: function (value) {
        return ((value > 0) - (value < 0)) || +value;
    },

    trunc: function (value) {
        return value < 0 ? _Math.ceil(value) : _Math.floor(value);
    }

});
