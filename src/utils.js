export var Obj = Object,
    Arr = Array,
    ArrProto = Arr.prototype,
    Str = String,
    StrProto = Str.prototype,
    Num = Number,
    TypeErr = TypeError,
    delay = setTimeout,
    none = undefined;

export var isFn = function (value) {
    return typeof value === 'function';
};

export var patch = function (target, name, polyfill) {
    if (!isFn(target[name])) {
        Obj.defineProperty(target, name, {
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
    if (value == none) {
        throw new TypeErr('Cannot convert undefined or null to object');
    }
}

export var createClass = function (constructor, prototype) {
    for (var key in prototype) {
        var desc = prototype[key];
        Obj.defineProperty(
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
        throw new TypeErr('Cannot call a class as a function');
    }
}

export var pick = function (value, standby) {
    return value !== none ? value : standby;
}

export var test = function (target, name, tester) {
    var value = target[name];
    if (!isFn(value) || !tester(value)) {
        delete target[name];
    }
}

export var findIndex = function (array, element) {
    return array.findIndex(function (ele) {
        return ele === element || ele !== ele && element !== element;
    });
};
