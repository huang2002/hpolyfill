import { patch, _window, _Object, createClass, createEmptyObject, _Array, defineProperty } from "./utils";
import { _Promise } from "./Promise";

var _Headers = patch(_window, 'Headers', createClass(
    function Headers() {
        var init = arguments[0];
        this._map = new Map(init && (
            init instanceof Headers ?
                init._map :
                _Array.isArray(init) ? init : _Object.entries(init)
        ));
    }, {
        append: function (name, value) {
            var map = this._map;
            if (map.has(name)) {
                map.set(name, map.get(name) + ', ' + value);
            } else {
                map.set(name, value);
            }
        },
        set: function (name, value) { return this._map.set(name, value); },
        get: function (name) { return this._map.get(name); },
        has: function (name) { return this._map.has(name); },
        delete: function (name) { return this._map.delete(name); },
        forEach: function (callback) { this._map.forEach(callback, arguments[1]); },
        keys: function () { return this._map.keys(); },
        values: function () { return this._map.values(); },
        entries: function () { return this._map.entries(); }
    }
));

var json = function () {
    var _this = this;
    return new _Promise(function (resolve) {
        resolve(JSON.parse(_this._body.toString()));
    });
}, text = function () {
    var _this = this;
    return new _Promise(function (resolve) {
        resolve(_this._body.toString());
    });
};

var REQUEST_INIT_DEFAULTS = {
    method: 'GET',
    credentials: 'same-origin'
};

var _Request = patch(_window, 'Request', createClass(
    function Request(resource) {
        var init;
        if (resource instanceof _Request) {
            defineProperty(this, 'url', resource.url);
            init = resource;
        } else {
            defineProperty(this, 'url', resource);
            init = arguments[1] || createEmptyObject();
        }
        _Object.keys(REQUEST_INIT_DEFAULTS).forEach(function (key) {
            if (key === 'headers' && key in init) {
                var headers = init[key];
                defineProperty(this, key,
                    headers instanceof _Headers ? headers : new _Headers(headers)
                );
            } else {
                defineProperty(this, key,
                    key in init ? init[key] : REQUEST_INIT_DEFAULTS[key]
                );
            }
        }, this);
        if (!this.headers) {
            defineProperty(this, 'headers', new _Headers());
        }
        if ('body' in this) {
            this._body = this.body;
            delete this.body;
        } else {
            this._body = '';
        }
    }, {
        clone: function () { return new _Request(this); },
        json: json,
        text: text
    }
));

var _Response = patch(_window, 'Response', createClass(
    function Response() {
        var args = arguments;
        this._body = args.length > 0 ? args[0] : '';
        if (args[1]) {
            _Object.entries(args[1]).forEach(function (entry) {
                if (entry[0] !== 'headers' || entry[1] instanceof _Headers) {
                    defineProperty(this, entry[0], entry[1]);
                } else {
                    defineProperty(this, entry[0], new _Headers(entry[1]));
                }
            }, this);
        }
        if (!this.headers) {
            defineProperty(this, 'headers', new _Headers());
        }
        if (!('status' in this)) {
            defineProperty(this, 'status', 200);
            defineProperty(this, 'statusText', 'OK');
        }
    }, {
        clone: function () {
            return new _Response(this._body, {
                headers: new _Headers(this.headers),
                status: this.status,
                statusText: this.statusText
            });
        },
        ok: {
            get: function () {
                return this.status >= 200 && this.status < 300;
            }
        },
        json: json,
        text: text
    }
));

var FETCH_INIT_DEFAULTS = {
    method: 'GET',
    credentials: 'omit'
};

patch(_window, 'fetch', function fetch(resource) {
    return new _Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest(),
            init = arguments[1];
        if (resource instanceof _Request) {
            init = _Object.assign(createEmptyObject(), resource, init);
            resource = resource.url;
        } else {
            init = _Object.assign(createEmptyObject(), FETCH_INIT_DEFAULTS, init);
        }
        xhr.open(init.method, resource);
        xhr.withCredentials = init.credentials !== 'omit';
        var headers = init.headers;
        if (headers) {
            if (headers instanceof _Headers) {
                headers.forEach(function (value, name) {
                    xhr.setRequestHeader(name, value);
                });
            } else if (_Array.isArray(headers)) {
                headers.forEach(function (header) {
                    xhr.setRequestHeader(header[0], header[1]);
                });
            } else {
                _Object.entries(headers, function (header) {
                    xhr.setRequestHeader(header[0], header[1]);
                });
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var headers = new _Headers();
                xhr.getAllResponseHeaders().split('\r\n').forEach(function (header) {
                    if (!header) {
                        return;
                    }
                    var splitIndex = header.indexOf(':');
                    headers.set(header.slice(0, splitIndex), header.slice(splitIndex + 1).trim());
                });
                resolve(new _Response(xhr.responseText, {
                    headers: headers,
                    status: xhr.status,
                    statusText: xhr.statusText
                }));
            }
        };
        xhr.onerror = reject;
        xhr.send(init.body);
    });
});
