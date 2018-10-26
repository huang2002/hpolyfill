import { patch, patchSome, pick, check, Arr, Str, StrProto, Num } from "./utils";
import { ITER_SYM } from "./Symbol";
import { arrIter } from "./Array";

patch(Str, 'raw', function (template) {

    check(template);

    var args = arguments,
        substitutionCount = args.length - 1,
        fragments = Arr.from(template.raw),
        gapCount = fragments.length - 1;

    return fragments.reduce(function (chunk, frag, i) {
        return chunk + (i < gapCount && i < substitutionCount ? frag + args[i + 1] : frag);
    }, '');

});

patchSome(StrProto, {

    repeat: function (count) {

        if (!Num.isFinite(count)) {
            throw new RangeError('repeat count must be infinite');
        } else if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
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

        var string = pick(arguments[1], ' '),
            strLen = string.length,
            padString = '';

        if (strLen === 0) {
            return this;
        }

        var result = this,
            delta = length - this.length;

        while (delta >= 0) {
            padString += (delta > strLen ? string : string.slice(0, delta));
            delta -= strLen;
        }

        return padString + result;

    },

    padEnd: function (length) {

        var string = pick(arguments[1], ' '),
            strLen = string.length;

        if (strLen === 0) {
            return this;
        }

        var result = this,
            delta = length - this.length;

        while (delta >= 0) {
            result += delta > strLen ? string : string.slice(0, delta);
            delta -= strLen;
        }

        return result;

    }

});

patch(StrProto, ITER_SYM, arrIter);
