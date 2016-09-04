"use strict";

var SessionStorage = require('../../src/security/storage');

describe('session storage', function () {
    it('should has an session storage, if sessionInterface is given', testSessionInterface);
    it('should throw an exception, when using the storage, but not interface is given', testExceptionWhenUsingStorageWithoutInterface);
    it('should call .get directly, when .get has more than 1 argument', testStorageCall);
    it('should call .exec when get has 1 argument and query does not extends the promise interface', testStorageCallWithExec);
    it('should use .get result as promise when get has 1 argument and query implements the promise interface', testStorageCallWithPromise);
    it('should return result from .get (sync) when .exec does not exist', testSyncStorageGet);
});

function testSessionInterface() {
    var storage = new SessionStorage(null);
    expect(storage.hasStorage()).toBeFalsy();

    storage.setStorage(new SimpleStorageInterface());

    expect(storage.hasStorage()).toBeTruthy();
    expect(storage.getStorage()).toEqual(jasmine.any(SimpleStorageInterface));
}

function testExceptionWhenUsingStorageWithoutInterface(done) {
    var storage = new SessionStorage(null);

    expect(function () { storage.getSession('', null); })
        .toThrow(jasmine.any(Error));

    storage.setStorage(new SimpleStorageInterface('test'));

    expect(function () { storage.getSession('test', done) })
        .not.toThrow(jasmine.any(Error));
}

function testStorageCall(done) {
    var storageInterface = new SimpleStorageInterface('get session');
    var storage = new SessionStorage(storageInterface);

    storage.getSession('get session', done);
}

function testStorageCallWithExec() {
    var execInterface = new ExecInterface();
    var storageInterface = new StorageInterface(execInterface);
    spyOn(execInterface, 'exec');

    var storage = new SessionStorage(storageInterface);
    storage.getSession('session name', function() {});

    expect(execInterface.exec).toHaveBeenCalledWith(jasmine.any(Function));
}

function testStorageCallWithPromise() {
    var promiseInterface = new PromiseInterface();
    var storageInterface = new StorageInterface(promiseInterface);
    var storage = new SessionStorage(storageInterface);
    var callable = function () {};

    spyOn(promiseInterface, 'then').and.returnValue('function');
    spyOn(promiseInterface, 'catch').and.returnValue('function');

    storage.getSession('get session from promise', callable);

    expect(promiseInterface.then).not.toHaveBeenCalledWith(callable);
    expect(promiseInterface.catch).not.toHaveBeenCalledWith(callable);
    expect(promiseInterface.then).toHaveBeenCalledWith(jasmine.any(Function));
    expect(promiseInterface.catch).toHaveBeenCalledWith(jasmine.any(Function));
}

function testSyncStorageGet(done) {
    var session = { session: '1' };
    var delegate = new SimpleSynchStorage('this one', session);
    var storage = new SessionStorage(delegate);

    storage.getSession('this one', function (err, result) {
        expect(err).toEqual(null);
        expect(result).toEqual(session);

        done();
    });
}

function ExecInterface() {
    this.exec = function(callable) {};
}

function PromiseInterface() {
    this.then = function(callable) {};
    this.catch = function(callable) {};
}

function SimpleStorageInterface(expected) {
    this.get = function(name, callable) {
        expect(name).toEqual(expected);

        callable(null, { session: 'example' });
    };
}

function SimpleSynchStorage(expected, session) {
    this.get = function(name) {
        expect(name).toEqual(expected);

        return session;
    };
}

function StorageInterface(executor) {
    this.get = function(name) {
        return executor;
    };
}
