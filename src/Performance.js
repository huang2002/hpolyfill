import { patch, _window } from "./utils";

var startTime = Date.now();

patch(
    patch(_window, 'performance', {}),
    'now',
    function () {
        return Date.now() - startTime;
    }
);
