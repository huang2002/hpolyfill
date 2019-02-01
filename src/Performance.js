import { patch, _window } from "./utils";

var _performance = patch(_window, 'performance', {});

var startTime = Date.now();

patch(_performance, 'now', function () {
    return (Date.now() - startTime) * 1000;
});
