# HPolyfill

This is a lightweight(less than 10KB) polyfill lib which includes some common polyfills.

## Usage

Just simply include one of the following script tags in your HTML to get the polyfills:

```html
<!-- via jsdelivr -->
<script type="text/javascript" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/hpolyfill@latest/dist/index.js"></script>
<!-- or via unpkg -->
<script type="text/javascript" crossorigin="anonymous" src="https://unpkg.com/hpolyfill@latest/dist/index.js"></script>
```

By the way, as a polyfill lib, this lib should be loaded first in most cases.

## Polyfill list

- Set
    - basic functionality
    - constructor arguments
    - convert `-0` key into `+0`
    - `set.add()` returning this
    - `set.forEach()`
    - `set.delete()`
    - `set.clear()`
    - `set.size`
    - `set[Symbol.iterator]()`
- Map
    - basic functionality
    - constructor arguments
    - convert `-0` key into `+0`
    - `map.set()` returning this
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
    - `array.keys()`
    - `array.values()`
    - `array.entries()`
    - `array[Symbol.iterator]()`
- Object
    - `Object.assign()`
    - `Object.is()`
    - `Object.keys()`
    - `Object.values()`
    - `Object.entries()`
    - `Object.fromEntries()`
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
    - `string.trimLeft()`
    - `string.trimRight()`
    - `string[Symbol.iterator]()`
- Symbol
    - basic functionality
    - `Symbol.for()`
    - `Symbol.keyFor()`
    - `Symbol.iterator`
    - `symbol.description`
- RAF
    - `requestAnimationFrame()`
    - `cancelAnimationFrame()`
- Performance
    - `performance.timeOrigin`
    - `performance.now()`

## ps

If you find any problem with this lib or something necessary but not included, feel free to open an issue.
