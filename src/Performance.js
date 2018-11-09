import { patch, win } from "./utils";

var PERF = 'performance';

patch(win, PERF, {});

export var perf = win[PERF];

patch(perf, 'now', function () {
    return Date.now();
});
