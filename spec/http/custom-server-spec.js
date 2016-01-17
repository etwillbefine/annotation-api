"use strict";

var CustomServer = require('../../src/http/index');
var HttpApp = require('../../src/http/app');

describe('build in server', function() {
    it('should create a http app and should set the default port', testDefaultValues);
});

function testDefaultValues() {
    var server = new CustomServer(-1, false);

    expect(server.getApp()).toEqual(jasmine.any(HttpApp));
    expect(server.getApp().getHTTPServer().getPort()).toEqual(3000);
}
