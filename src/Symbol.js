import { patch, patchSome, Str, win } from "./utils";

patch(win, 'Symbol', function () {
    var tag = arguments.length > 0 ? arguments[0] : '';
    return '@@' + tag + '-' + Math.random().toString(32).slice(2);
});

var Sym = Symbol;

var keys = [],
    symbols = [];

patchSome(Sym, {

    for: function (key) {
        key = Str(key);
        var index = keys.indexOf(key);
        if (~index) {
            return symbols[index];
        } else {
            var symbol = Sym(key);
            keys.push(key);
            symbols.push(symbol);
            return symbol;
        }
    },

    keyFor: function (symbol) {
        var index = symbols.indexOf(symbol);
        if (~index) {
            return keys[index];
        }
    }

});

export var ITER_SYM = Sym.iterator || (Sym.iterator = Sym('Symbol.iterator'));
