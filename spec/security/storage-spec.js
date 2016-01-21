"use strict";

var SessionStroage = require('../../src/security/storage');

describe('session storage', function () {
    it('should has an session storage, if sessionInterface is given', testSessionInterface);
    it('should throw an exception, when using the storage, but not interface is given', testExceptionWhenUsingStorageWithoutInterface);
    it('should call .get directly, when .get has more than 1 argument', testStorageCall);
    it('should call exec when get has 1 argument and query does not have the promise interface', testStorageCallWithExec);
    it('should use .get result as promise when get has 1 argument and query implements the promise interface', testStorageCallWithPromise);
});

function testSessionInterface() {
    var storage = new SessionStroage(null);
    expect(storage.hasStorage()).toBeFalsy();

    storage.setStorage(new SimpleStorageInterface());

    expect(storage.hasStorage()).toBeTruthy();
    expect(storage.getStorage()).toEqual(jasmine.any(SimpleStorageInterface));
}

function testExceptionWhenUsingStorageWithoutInterface() {
    var storage = new SessionStroage(null);

    expect(function () { storage.getSession('', null); })
        .toThrow(jasmine.any(Error));

    storage.setStorage(new SimpleStorageInterface());

    expect(function () { storage.getSession('', null) })
        .not.toThrow(jasmine.any(Error));
}

function testStorageCall() {
    var storageInterface = new SimpleStorageInterface();
    var storage = new SessionStroage(storageInterface);
    spyOn(storageInterface, 'get');

    storage.getSession('call get session', function() {});

    expect(storageInterface.get).toHaveBeenCalledWith('call get session', jasmine.any(Function));
}

function testStorageCallWithExec() {
    var execInterface = new ExecInterface();
    var storageInterface = new StorageInterface(execInterface);
    spyOn(execInterface, 'exec');

    var storage = new SessionStroage(storageInterface);
    storage.getSession('session name', function() {});

    expect(execInterface.exec).toHaveBeenCalledWith(jasmine.any(Function));
}

function testStorageCallWithPromise() {
    var promiseInterface = new PromiseInterface();
    var storageInterface = new StorageInterface(promiseInterface);
    var storage = new SessionStroage(storageInterface);
    var callable = function () {};

    spyOn(promiseInterface, 'then').and.returnValue('function');
    spyOn(promiseInterface, 'catch').and.returnValue('function');

    storage.getSession('get session from promise', callable);

    expect(promiseInterface.then).not.toHaveBeenCalledWith(callable);
    expect(promiseInterface.catch).not.toHaveBeenCalledWith(callable);
    expect(promiseInterface.then).toHaveBeenCalledWith(jasmine.any(Function));
    expect(promiseInterface.catch).toHaveBeenCalledWith(jasmine.any(Function));
}

function ExecInterface() {
    this.exec = function(callable) {};
}

function PromiseInterface() {
    this.then = function(callable) {};
    this.catch = function(callable) {};
}

function SimpleStorageInterface() {
    this.get = function(name, callable) {};
}

function StorageInterface(executor) {
    this.get = function(name) {
        return executor;
    };
}
