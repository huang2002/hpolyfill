"use strict";
const outputEle = document.getElementById('output');
function assert(actual, expected) {
    if (arguments.length < 2) {
        expected = true;
    }
    if (actual === expected) {
        outputEle.innerHTML += '<li class="log">' + JSON.stringify(expected) + ' passed.' + '</li>';
    } else {
        const msg = JSON.stringify(expected) + ' actual->' + JSON.stringify(actual);
        outputEle.innerHTML += '<li class="err">Expect->' + msg + '</li>';
        console.trace(JSON.stringify(expected) + ' actual->' + JSON.stringify(actual));
    }
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
}, testObject);
assert(o, t);
assert(t.temp);
assert(t.mode, 'test');
assert(t.test, undefined);

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

// array
assert([0].includes(-0));
assert([NaN].includes(NaN));
assert([NaN].includes(NaN, 1), false);
assert([{}].includes({}), false);
assert([0, 1, 2].fill(6).join(), '6,6,6');
assert([0, 1, 2].fill(6, 1, 2).join(), '0,6,2');
assert([0, [1, 2], [[3]]].flat(Infinity).join(), '0,1,2,3');
assert([0, [1, 2], [3]].flatMap(function (x) { return x + ''; }).join(' '), '0 1,2 3');
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
    finallyHasCalled = false;
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
    finallyHasCalled = true;
});
setTimeout(function () {
    assert(finallyHasCalled);
}, 1000);
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
