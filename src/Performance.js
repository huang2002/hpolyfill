import { patch, win } from "./utils";

var PERF = 'performance';

patch(win, PERF, {});

patch(win[PERF], 'now', function () {
    return Date.now();
});
