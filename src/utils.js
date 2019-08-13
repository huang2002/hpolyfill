export var PROTOTYPE = 'prototype';

export var _window = window,
    _Object = Object,
    _defineProperty = _Object.defineProperty,
    _Array = Array,
    _ArrayPrototype = _Array[PROTOTYPE],
    _String = String,
    _StringPrototype = _String[PROTOTYPE],
    _Number = Number,
    _TypeError = TypeError,
    _RangeError = RangeError,
    _setTimeout = setTimeout,
    _clearTimeout = clearTimeout,
    _NaN = NaN,
    _undefined = undefined;

export var isType = function (value, type) {
    return typeof value === type;
};

export var isFn = function (value) {
    return isType(value, 'function');
};

export var patch = function (target, name, polyfill) {
    if (!target[name]) {
        var isFnPolyfill = isFn(polyfill);
        _defineProperty(target, name, {
            value: polyfill,
            configurable: isFnPolyfill,
            writable: isFnPolyfill
        });
        return polyfill;
    } else {
        return target[name];
    }
}

export var patchSome = function (target, map) {
    for (var name in map) {
        patch(target, name, map[name]);
    }
}

export var removeIndex = function (array, index) {
    var length = array.length;
    for (var i = index + 1; i < length; i++) {
        array[i - 1] = array[i];
    }
    array.length--;
}

export var check = function (value) {
    if (value == _undefined) {
        throw new _TypeError('Cannot convert undefined or null to object');
    }
}

export var createClass = function (constructor, prototype) {
    for (var key in prototype) {
        var desc = prototype[key];
        _defineProperty(
            constructor[PROTOTYPE],
            key,
            (isType(desc, 'object') && desc.get) ?
                { configurable: true, get: desc.get } :
                { configurable: true, writable: true, value: desc }
        );
    }
    return constructor;
}

export var checkThis = function (self, constructor) {
    if (!(self instanceof constructor)) {
        throw new _TypeError('Cannot call a class as a function');
    }
}

export var pick = function (value, standby) {
    return value !== _undefined ? value : standby;
}

export var test = function (target, name, tester) {
    var value = target[name];
    if (!isFn(value) || !tester(value)) {
        delete target[name];
    }
}

export var createEmptyObject = function () {
    return _Object.create(null);
};

export var defineProperty = function (object, name, value) {
    _defineProperty(object, name, {
        get: function () { return value; },
        enumerable: true
    });
};
