"use strict";

// helpers

const outputEle = document.getElementById('output'),
    stringify = JSON.stringify;

function print(type, msg) {
    outputEle.innerHTML += '<li class="' + type + '">' + msg + '</li>';
}

function assert(actual, expected) {
    if (arguments.length < 2) {
        expected = true;
    }
    if (actual === expected) {
        print('log', stringify(expected) + ' passed.' + '</li>');
    } else {
        print('err', 'expect->' + stringify(expected) + ' actual->' + stringify(actual) + '</li>');
        console.trace(stringify(expected) + ' actual->' + stringify(actual));
        if (arguments.length > 2) {
            console.log(arguments[2]);
        }
    }
}

function iterate(iterator) {
    var result = [],
        t = iterator.next();
    while (!t.done) {
        result.push(t.value);
        t = iterator.next();
    };
    return result;
}

function iterable2array(iterable) {
    return iterate(iterable[Symbol.iterator]());
}

let o, t;

// Object
function TestObject() {
    this.mode = 'test';
}
TestObject.prototype.test = function () {
    return true;
};
const testObject = new TestObject();
o = {};
t = Object.assign(o, {
    temp: true
}, undefined, null, testObject);
assert(o, t);
assert(t.temp);
assert(t.mode, 'test');
assert(t.test, undefined);
assert(Object.keys({ a: 0, b: 1, c: 2 }).sort().join(''), 'abc');
assert(Object.values({ a: 'd', b: 'e', c: 'f' }).sort().join(''), 'def');
assert(
    Object.entries({ a: 'd', b: 'e', c: 'f' })
        .map(function (a) { return a.join(''); })
        .sort().join(''),
    'adbecf'
);

// Number
assert(Number.isNaN(NaN));
assert(Number.isNaN('not a number'), false);
assert(Number.isFinite(0));
assert(Number.isFinite(NaN), false);
assert(Number.isFinite(Infinity), false);
assert(Number.isFinite('not finite'), false);

// Array
(function () {
    assert(Array.from(arguments).join(), '0,1');
})(0, 1);
assert(Array.from([0, 1]).join(), '0,1');
assert(Array.from('abcd').join(), 'a,b,c,d');
assert(Array.from(new Set([2, 0, 1, 9])).join(), '2,0,1,9');
assert(Array.from(new Map([[2, 0], [1, 9]])).join(';'), '2,0;1,9');

// array
assert([NaN].indexOf(NaN), 0);
assert([0].includes(-0));
assert([NaN].includes(NaN));
assert([NaN].includes(NaN, 1), false);
assert([{}].includes({}), false);
assert([0, 1, 2].fill(6).join(), '6,6,6');
assert([0, 1, 2].fill(6, 1, 2).join(), '0,6,2');
assert([0, [1, [2, 3]]].flat().join(';'), '0;1;2,3');
assert([0, [1, 2], [[3]]].flat(Infinity).join(), '0,1,2,3');
assert([0, [1, 2], [3]].flatMap(function (x) { return '' + x; }).join(' '), '0 1,2 3');
assert([0, 2, 4].find(function (x) { return x > 1; }), 2);
assert([0, 1, 2].findIndex(function (x) { return x > 1; }), 2);

// Set
let set = new Set([+0, -0]);
assert(set.size, 1);
assert(set.has(-0));

// Map
let map = new Map([[+0, 1], [-0, -1]]);
assert(map.size, 1);
assert(map.get(-0), -1);

// String
assert(String.raw({ raw: ['a', 'c'] }, 'b', 'd'), 'abc');

// string
assert('test'.includes('es'));
assert('test'.includes('es', 1));
assert('test'.includes('es', 2), false);
assert('test'.repeat(2), 'test' + 'test');
assert('test'.repeat(1.5), 'test');
assert('test'.repeat(0), '');
assert('test'.startsWith('te'));
assert('test'.startsWith('es', 1));
assert('test'.endsWith('st'));
assert('test'.endsWith('es', 3));
assert('test'.padStart(6), '  test');
assert('test'.padStart(6, 'abc'), 'ab' + 'test');
assert('test'.padStart(8, 'abc'), 'abca' + 'test');
assert('test'.padEnd(6), 'test  ');
assert('test'.padEnd(6, 'abc'), 'test' + 'ab');
assert('test'.padEnd(8, 'abc'), 'test' + 'abca');

// Symbol
function typeOf(v) {
    const type = typeof v;
    return v && type === 'object' && v.constructor === Symbol && v !== Symbol.prototype ?
        'symbol' : type;
}
assert(typeOf(Symbol('test')), 'symbol');
assert(String(Symbol('test')), 'Symbol(test)');
assert(Symbol('test') !== Symbol('test'));
assert(Symbol('test') !== Symbol.for('test'));
assert(Symbol.for('test') === Symbol.for('test'));
assert(Symbol.keyFor(Symbol.for('test')), 'test');
assert(Symbol.keyFor(Symbol.for({ toString: function () { return 'foo'; } })), 'foo');

// iterators
assert(iterable2array([0, 1, 2]).join(), '0,1,2');
assert(iterable2array(new Set([0, 1, 2])).join(), '0,1,2');
assert(iterable2array(new Map([[0, 1], [2, 3]])).join(';'), '0,1;2,3');
assert(iterate([3, 4, 5].keys()).join(''), '012');
assert(iterate([3, 4, 5].values()).join(''), '345');
assert(iterate([3, 4, 5].entries()).join(';'), '0,3;1,4;2,5');

// Promise
function resolveLater(data, delay) {
    return new Promise(function (y, n) { setTimeout(y, delay, data); });
}
function rejectLater(reason, delay) {
    return new Promise(function (y, n) { setTimeout(n, delay, reason); });
}
const dataY = 'data-y',
    dataN = 'data-n',
    dataThen = 'data-then',
    dataResolve = 'data-resolve',
    dataReject = 'data-reject';
let p = resolveLater(dataY, 100),
    finallyHasBeenCalled = false;
p.then(function (data) {
    assert(data, dataY);
    return dataThen;
}, function (err) {
    assert(undefined, err);
}).then(function (data) {
    assert(data, dataThen);
    return Promise.resolve(dataResolve);
}).then(function (data) {
    assert(data, dataResolve);
    return Promise.reject(dataReject);
}, function (err) {
    assert(undefined, err);
}).catch(function (err) {
    assert(err, dataReject);
}).finally(function (finallyData) {
    assert(finallyData, undefined);
    finallyHasBeenCalled = true;
});
setTimeout(function () {
    assert(finallyHasBeenCalled);
}, 2000);
const testData = 'test data',
    testValue = 'test value',
    testReason = 'test reason';
(new Promise(function (y, n) {
    y(Promise.resolve(testData));
})).then(function (data) {
    assert(data, testData);
});
(new Promise(function (y, n) {
    n(testValue);
})).catch(function (value) {
    assert(value, testValue);
});
(new Promise(function (y, n) {
    y(Promise.reject(testReason));
})).catch(function (reason) {
    assert(reason, testReason);
});
const usefulReason = 'useful reason',
    fastestData = 'fastest data',
    fastReason = 'fast reason';
Promise.all([
    resolveLater('d0', 100),
    resolveLater('d1', 50),
    resolveLater('d2', 150)
]).then(function (dataArray) {
    assert(dataArray.join(), 'd0,d1,d2');
}, function (reason) {
    assert(reason, undefined);
});
Promise.all([
    resolveLater('useless data 0', 100),
    rejectLater(usefulReason, 150)
]).then(function (dataArray) {
    assert(dataArray, undefined);
}, function (reason) {
    assert(reason, usefulReason);
});
Promise.race([
    resolveLater('second fastest data', 50),
    resolveLater(fastestData, 40),
    rejectLater('useless reason', 60)
]).then(function (data) {
    assert(data, fastestData);
});
Promise.race([
    resolveLater('useless data 1', 80),
    resolveLater('useless data 2', 90),
    rejectLater(fastReason, 70)
]).then(function (data) {
    assert(data, undefined);
}, function (reason) {
    assert(reason, fastReason);
});

// RAF
let flagRAF = false;
requestAnimationFrame(function () {
    flagRAF = true;
});
setTimeout(function () {
    assert(flagRAF);
}, 1000);

// performance
const perfTiming0 = performance.now(),
    perfTestDelay = 1000,
    perfTestAccept = 1000;
setTimeout(function () {
    assert(Math.abs(performance.now() - perfTiming0 - perfTestDelay) < perfTestAccept);
}, perfTestDelay);
