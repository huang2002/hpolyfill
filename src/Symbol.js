import { patch, patchSome, findIndex } from "./utils";

patch(window, 'Symbol', function () {
    var tag = arguments.length > 0 ? arguments[0] : '';
    return '@@' + tag + '-' + Math.random().toString(32).slice(2);
});

var keys = [],
    symbols = [];

patchSome(Symbol, {

    for: function (key) {
        var index = findIndex(keys, key);
        if (index >= 0) {
            return symbols[index];
        } else {
            var symbol = Symbol(key);
            keys.push(key);
            symbols.push(symbol);
            return symbol;
        }
    },

    keyFor: function (symbol) {
        var index = findIndex(symbols, symbol);
        if (index >= 0) {
            return keys[index];
        }
    }

});
