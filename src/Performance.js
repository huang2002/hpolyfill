import { patch, _window } from "./utils";

var _Performance = patch(_window, 'Performance', {});

var startTime = Date.now();

patch(_Performance, 'now', function () {
    return (Date.now() - startTime) * 1000;
});
