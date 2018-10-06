export function patch(target, name, polyfill) {
    if (typeof target[name] !== 'function') {
        Object.defineProperty(target, name, {
            value: polyfill,
            configurable: true,
            writable: true
        });
    }
}

export function patchSome(target, map) {
    for (var name in map) {
        patch(target, name, map[name]);
    }
}

export function check(value) {
    if (value == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
}

export function createClass(constructor, prototype) {
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

export function checkThis(self, constructor) {
    if (!(self instanceof constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

export function pick(value, standby) {
    return value !== undefined ? value : standby;
}

export function test(target, name, tester) {
    var value = target[name];
    if (typeof value !== 'function' || !tester(value)) {
        delete target[name];
    }
}
