import { patch, win } from "./utils";

var PERF = 'performance';

patch(win, PERF, {});

var timingOffset = Date.now();

patch(win[PERF], 'now', function () {
    return (Date.now() - timingOffset) * 1000;
});
