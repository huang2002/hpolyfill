import { patch, win, delay, clearDelay, test } from "./utils";

var RAF = 'requestAnimationFrame',
    CAF = 'cancelAnimationFrame';

test(win, RAF, function () {
    return win[CAF];
});

patch(win, CAF, win.webkitCancelAnimationFrame || function (id) {
    clearDelay(id);
});

patch(win, RAF, win.webkitRequestAnimationFrame || function (callback) {
    return delay(callback, 15);
});
