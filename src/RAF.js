import { patch, _window, _setTimeout, _clearTimeout, test } from "./utils";

var RAF = 'requestAnimationFrame',
    CAF = 'cancelAnimationFrame';

test(_window, RAF, function () {
    return _window[CAF];
});

patch(_window, CAF, _window.webkitCancelAnimationFrame || function (id) {
    _clearTimeout(id);
});

patch(_window, RAF, _window.webkitRequestAnimationFrame || function (callback) {
    return _setTimeout(callback, 15);
});
