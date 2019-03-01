import { patch, patchSome, _String, _window, PROTOTYPE, _Object } from "./utils";

var SYMBOL = 'Symbol';

var SymbolPolyfill = function Symbol() {
    var description = arguments.length > 0 ? arguments[0] : '';
    return {
        constructor: _Symbol,
        description: description,
        toString: function () {
            return SYMBOL + '(' + description + ')';
        }
    };
};

var _Symbol = patch(_window, SYMBOL, SymbolPolyfill);

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

if (_Symbol !== SymbolPolyfill) {
    var _SymbolPrototype = _Symbol[PROTOTYPE],
        DESCRIPTION = 'description';
    if (!_SymbolPrototype.hasOwnProperty(DESCRIPTION)) {
        _Object.defineProperty(_SymbolPrototype, DESCRIPTION, {
            get: function () {
                return _String(this).slice(7, -1);
            }
        });
    }
}

export var SYMBOL_ITERATOR = patch(_Symbol, 'iterator', _Symbol('Symbol.iterator'));
