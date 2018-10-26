import { patch, patchSome, createClass, checkThis, delay, none, isFn } from "./utils";

var STATUS_PENDING = 'pending',
    STATUS_RESOLVED = 'resolved',
    STATUS_REJECTED = 'rejected';

var Pro;

patch(window, 'Promise', createClass(
    function Promise(executor) {
        checkThis(this, Pro);

        this._wait = true;
        this._status = STATUS_PENDING;
        this._value = none;
        this._hasErrorHandled = false;
        this._onresolved = [];
        this._onrejected = [];

        try {
            executor(this._resolve.bind(this), this._reject.bind(this));
        } catch (error) {
            this._reject(error);
        }

    },
    {

        _resolved: {
            value: function (data) {
                if (data instanceof Pro) {
                    data.then(this._resolved.bind(this), this._rejected.bind(this));
                } else {
                    this._status = STATUS_RESOLVED;
                    this._value = data;
                    var callbacks = this._onresolved;
                    delay(function () {
                        callbacks.forEach(function (callback) {
                            callback(data);
                        });
                    });
                }
            }
        },

        _resolve: {
            value: function (data) {
                if (this._wait) {
                    this._wait = false;
                    this._resolved(data);
                }
            }
        },

        _rejected: {
            value: function (reason) {
                this._status = STATUS_REJECTED;
                this._value = reason;
                var callbacks = this._onrejected,
                    self = this;
                delay(function () {
                    if (callbacks.length) {
                        callbacks.forEach(function (callback) {
                            callback(reason);
                        });
                    } else if (!self._hasErrorHandled) {
                        console.error('Uncaught (in promise)', reason);
                    }
                });
            }
        },

        _reject: {
            value: function (reason) {
                if (this._wait) {
                    this._wait = false;
                    this._rejected(reason);
                }
            }
        },

        then: {
            value: function (onresolved, onrejected) {

                var self = this;

                return new Pro(function (resolve, reject) {

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

                    } else if (status === STATUS_RESOLVED) {

                        if (isFn(onresolved)) {
                            delay(function () {
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
                            delay(function () {
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
            }
        },

        catch: {
            value: function (callback) {
                return this.then(null, callback);
            }
        }

    }
));

Pro = Promise;

patchSome(Pro, {

    race: function (promises) {
        return new Pro(function (resolve, reject) {
            promises.forEach(function (promise) {
                promise.then(resolve, reject);
            });
        });
    },

    all: function (promises) {
        return new Pro(function (resolve, reject) {

            var rest = promises.length,
                results = new Array(rest);

            promises.forEach(function (promise, i) {
                promise.then(function (data) {
                    results[i] = data;
                    if (--rest === 0) {
                        resolve(results);
                    }
                }, reject);
            });

        });
    },

    resolve: function (data) {
        return data instanceof Pro ? data : new Pro(function (resolve) {
            resolve(data);
        });
    },

    reject: function (reason) {
        return new Pro(function (resolve, reject) {
            reject(reason);
        });
    }

});

patch(Pro.prototype, 'finally', function (callback) {
    this.then(function (data) {
        callback();
        return data;
    }, function (error) {
        callback();
        throw error;
    });
});
