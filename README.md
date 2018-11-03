# HPolyfill

This is a lightweight(less than 10KB after minimization) polyfill lib which only includes some common polyfills:

- Set
    - basic functionality
    - constructor arguments
    - `set.add()` returns this
    - convert `-0` key into `+0`
    - `set.forEach()`
    - `set.delete()`
    - `set.clear()`
    - `set.size`
    - `set[Symbol.iterator]()`
- Map
    - basic functionality
    - constructor arguments
    - `map.set()` returns this
    - convert `-0` key into `+0`
    - `map.forEach()`
    - `map.delete()`
    - `map.clear()`
    - `map.size`
    - `map[Symbol.iterator]()`
- Promise
    - basic functionality
    - `Promise.all()`
    - `Promise.race()`
    - `Promise.resolve()`
    - `Promise.reject()`
    - `promise.finally()`
- Array
    - `Array.from()`
    - `Array.of()`
    - `array.includes()`
    - `array.fill()`
    - `array.find()`
    - `array.findIndex()`
    - `array.flat()`
    - `array.flatMap()`
    - `array[Symbol.iterator]()`
    - `array.keys()`
    - `array.values()`
    - `array.entries()`
- Object
    - `Object.assign()`
    - `Object.is()`
    - `Object.keys()`
    - `Object.values()`
    - `Object.entries()`
- Number
    - `Number.isNaN()`
    - `Number.isFinite()`
- String
    - `String.raw()`
    - `string.includes()`
    - `string.repeat()`
    - `string.startsWith()`
    - `string.endsWith()`
    - `string.padStart()`
    - `string.padEnd()`
    - `string[Symbol.iterator]()`
- Symbol
    - basic functionality
    - `Symbol.for()`
    - `Symbol.keyFor()`
    - `Symbol.iterator`

# ps

If you find any problem or something necessary not included in this lib, feel free to open an issue.
