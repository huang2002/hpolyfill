import { patch, patchSome, createClass, checkThis, _setTimeout, _undefined, isFn, _window, PROTOTYPE, _Array } from "./utils";

var STATUS_PENDING = 'pending',
    STATUS_FULFILLED = 'fulfilled',
    STATUS_REJECTED = 'rejected';

export var _Promise = patch(_window, 'Promise', createClass(
    function Promise(executor) {
        checkThis(this, _Promise);

        this._isWaiting = true;
        this._status = STATUS_PENDING;
        this._value = _undefined;
        this._hasErrorHandled = false;
        this._onresolved = [];
        this._onrejected = [];

        try {
            executor(this._resolver.bind(this), this._rejecter.bind(this));
        } catch (error) {
            this._rejecter(error);
        }

    },
    {

        _resolve: function (data) {
            if (data instanceof _Promise) {
                data.then(this._resolve.bind(this), this._reject.bind(this));
            } else {
                this._status = STATUS_FULFILLED;
                this._value = data;
                var callbacks = this._onresolved;
                _setTimeout(function () {
                    callbacks.forEach(function (callback) {
                        callback(data);
                    });
                });
            }
        },

        _resolver: function (data) {
            if (this._isWaiting) {
                this._isWaiting = false;
                this._resolve(data);
            }
        },

        _reject: function (reason) {
            this._status = STATUS_REJECTED;
            this._value = reason;
            var callbacks = this._onrejected,
                self = this;
            _setTimeout(function () {
                if (callbacks.length) {
                    callbacks.forEach(function (callback) {
                        callback(reason);
                    });
                } else if (!self._hasErrorHandled) {
                    console.error('Uncaught (in promise)', reason);
                }
            });
        },

        _rejecter: function (reason) {
            if (this._isWaiting) {
                this._isWaiting = false;
                this._reject(reason);
            }
        },

        then: function (onresolved, onrejected) {

            var self = this;

            return new _Promise(function (resolve, reject) {

                var status = self._status;

                if (status === STATUS_PENDING) {

                    if (isFn(onrejected)) {
                        self._onrejected.push(function (reason) {
                            try {
                                onrejected(reason);
                            } catch (error) {
                                reject(error);
                            }
                        });
                    }

                    if (isFn(onresolved)) {
                        self._onresolved.push(function (data) {
                            try {
                                resolve(onresolved(data));
                            } catch (error) {
                                reject(error);
                            }
                        });
                    } else {
                        self._onresolved.push(resolve);
                    }

                    self._onrejected.push(function (reason) {
                        if (self._onrejected.length > 1) {
                            resolve();
                        } else {
                            reject(reason);
                        }
                    });

                } else if (status === STATUS_FULFILLED) {

                    if (isFn(onresolved)) {
                        _setTimeout(function () {
                            try {
                                resolve(onresolved(self._value));
                            } catch (error) {
                                reject(error);
                            }
                        });
                    } else {
                        resolve(self._value);
                    }

                } else {

                    if (isFn(onrejected)) {
                        self._hasErrorHandled = true;
                        _setTimeout(function () {
                            try {
                                onrejected(self._value);
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        });
                    } else {
                        resolve();
                    }

                }

            });
        },

        catch: function (callback) {
            return this.then(null, callback);
        }

    }
));

patchSome(_Promise, {

    race: function (promises) {
        return new _Promise(function (resolve, reject) {
            _Array.from(promises).forEach(function (element) {
                if (element && element.then) {
                    element.then(resolve, reject);
                } else {
                    resolve(element);
                }
            });
        });
    },

    all: function (promises) {
        return new _Promise(function (resolve, reject) {

            var rest = promises.length,
                results = new Array(rest);

            _Array.from(promises).forEach(function (element, i) {
                if (element && element.then) {
                    element.then(
                        function (data) {
                            results[i] = data;
                            if (--rest === 0) {
                                resolve(results);
                            }
                        },
                        reject
                    );
                } else {
                    results[i] = element;
                    if (--rest === 0) {
                        resolve(results);
                    }
                }
            });

        });
    },

    resolve: function (data) {
        return data instanceof _Promise ? data : new _Promise(function (resolve) {
            resolve(data);
        });
    },

    reject: function (reason) {
        return new _Promise(function (resolve, reject) {
            reject(reason);
        });
    }

});

patch(_Promise[PROTOTYPE], 'finally', function (callback) {
    return this.then(function (data) {
        callback();
        return data;
    }, function (error) {
        callback();
        throw error;
    });
});
