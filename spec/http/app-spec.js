"use strict";

var HttpApp = require('../../src/http/app');
var HttpServer = require('../../src/http/server');

describe('http app', function () {
    it('should create an http server', testHttpServerCreation);
    it('should put routes to routing stack', testRoutingStack);
});

function testHttpServerCreation() {
    var app = new HttpApp(100, false);

    expect(app.getHTTPServer()).toEqual(jasmine.any(HttpServer));
    expect(app.getHTTPServer().getPort()).toEqual(100);
}

function testRoutingStack() {
    var callable = function () {};
    var app = new HttpApp(100, false);
    app.getHTTPServer().putToStack = jasmine.createSpy('putToStack');

    app.get('r1', callable);
    app.post('r2', callable);
    app.put('r3', callable);

    expect(app.getHTTPServer().putToStack).toHaveBeenCalledWith('get', 'r1', callable);
    expect(app.getHTTPServer().putToStack).toHaveBeenCalledWith('post', 'r2', callable);
    expect(app.getHTTPServer().putToStack).toHaveBeenCalledWith('put', 'r3', callable);
    expect(app.getHTTPServer().putToStack).toHaveBeenCalledTimes(3);
}
