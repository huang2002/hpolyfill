import { patch, patchSome, pick, check, _Array, _String, _StringPrototype, _Number, _RangeError } from "./utils";
import { SYMBOL_ITERATOR } from "./Symbol";
import { arrayIterator } from "./Array";

patch(_String, 'raw', function (template) {

    check(template);

    var args = arguments,
        substitutionCount = args.length - 1,
        fragments = _Array.from(template.raw),
        gapCount = fragments.length - 1;

    return fragments.reduce(function (chunk, frag, i) {
        return chunk + (i < gapCount && i < substitutionCount ? frag + args[i + 1] : frag);
    }, '');

});

patchSome(_StringPrototype, {

    repeat: function (count) {

        if (!_Number.isFinite(count)) {
            throw new _RangeError('repeat count must be infinite');
        } else if (count < 0) {
            throw new _RangeError('repeat count must be non-negative');
        }

        count <<= 0;

        var result = '';

        for (var i = 0; i < count; i++) {
            result += this;
        }

        return result;

    },

    includes: function (string) {
        var start = pick(arguments[1], 0),
            delta = this.length - start - string.length;
        for (var i = 0; i <= delta; i++) {
            if (this.startsWith(string, start + i)) {
                return true;
            }
        }
        return false;
    },

    startsWith: function (string) {
        var start = pick(arguments[1], 0),
            length = string.length;
        for (var i = 0; i < length; i++) {
            if (string[i] !== this[start + i]) {
                return false;
            }
        }
        return true;
    },

    endsWith: function (string) {
        var length = string.length,
            start = pick(arguments[1], this.length) - length;
        for (var i = 0; i < length; i++) {
            if (string[i] !== this[start + i]) {
                return false;
            }
        }
        return true;
    },

    padStart: function (length) {

        var padStr = pick(arguments[1], ' '),
            padStrLen = padStr.length,
            padding = '';

        if (padStrLen === 0) {
            return this;
        }

        var result = this,
            delta = length - this.length;

        while (delta >= 0) {
            padding += (delta > padStrLen ? padStr : padStr.slice(0, delta));
            delta -= padStrLen;
        }

        return padding + result;

    },

    padEnd: function (length) {

        var padStr = pick(arguments[1], ' '),
            padStrLen = padStr.length;

        if (padStrLen === 0) {
            return this;
        }

        var result = this,
            delta = length - this.length;

        while (delta >= 0) {
            result += delta > padStrLen ? padStr : padStr.slice(0, delta);
            delta -= padStrLen;
        }

        return result;

    }

});

patch(_StringPrototype, SYMBOL_ITERATOR, arrayIterator);
