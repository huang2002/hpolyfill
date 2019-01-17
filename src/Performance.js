import { patch, _window } from "./utils";

var PERFORMANCE = 'performance';

patch(_window, PERFORMANCE, {});

var startTime = Date.now();

patch(_window[PERFORMANCE], 'now', function () {
    return (Date.now() - startTime) * 1000;
});
