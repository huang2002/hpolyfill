import { patchSome, _Number, _window, isType } from "./utils";

var _isFinite = _window.isFinite;

patchSome(_Number, {

    isNaN: function (value) {
        return value !== value;
    },

    isFinite: function (value) {
        return isType(value, 'number') && _isFinite(value);
    }

});
