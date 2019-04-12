import { patch, _window } from "./utils";

var _performance = patch(_window, 'performance', {});

patch(_performance, 'timeOrigin', Date.now());

patch(_performance, 'now', function () {
    return Date.now() - _performance.timeOrigin;
});
