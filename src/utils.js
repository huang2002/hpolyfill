export var patch = function (target, name, polyfill) {
    if (typeof target[name] !== 'function') {
        Object.defineProperty(target, name, {
            value: polyfill,
            configurable: true,
            writable: true
        });
    }
}

export var patchSome = function (target, map) {
    for (var name in map) {
        patch(target, name, map[name]);
    }
}

export var check = function (value) {
    if (value == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
}

export var createClass = function (constructor, prototype) {
    for (var key in prototype) {
        var desc = prototype[key];
        Object.defineProperty(
            constructor.prototype,
            key,
            desc.value ?
                { configurable: true, writable: true, value: desc.value } :
                { configurable: true, get: desc.get }
        );
    }
    return constructor;
}

export var checkThis = function (self, constructor) {
    if (!(self instanceof constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

export var pick = function (value, standby) {
    return value !== undefined ? value : standby;
}

export var test = function (target, name, tester) {
    var value = target[name];
    if (typeof value !== 'function' || !tester(value)) {
        delete target[name];
    }
}

export var findIndex = function (array, element) {
    return array.findIndex(function (ele) {
        return ele === element || ele !== ele && element !== element;
    });
};
