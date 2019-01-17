import { patch, patchSome, _String, _window } from "./utils";

var SYMBOL = 'Symbol';

patch(_window, SYMBOL, function () {
    var tag = arguments.length > 0 ? arguments[0] : '';
    return {
        constructor: _Symbol,
        toString: function () {
            return SYMBOL + '(' + tag + ')';
        }
    };
});

var _Symbol = Symbol;

var symbolRegistry_keys = [],
    symbolRegistry_symbols = [];

patchSome(_Symbol, {

    for: function (key) {
        key = _String(key);
        var index = symbolRegistry_keys.indexOf(key);
        if (~index) {
            return symbolRegistry_symbols[index];
        } else {
            var symbol = _Symbol(key);
            symbolRegistry_keys.push(key);
            symbolRegistry_symbols.push(symbol);
            return symbol;
        }
    },

    keyFor: function (symbol) {
        var index = symbolRegistry_symbols.indexOf(symbol);
        if (~index) {
            return symbolRegistry_keys[index];
        }
    }

});

export var SYMBOL_ITERATOR = _Symbol.iterator || (_Symbol.iterator = _Symbol('Symbol.iterator'));
