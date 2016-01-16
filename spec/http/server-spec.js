"use strict";

var HttpServer = require('../../src/http/server');

describe('server', function () {
    it('should push route to stack', testPushOnStack);
    it('should ', testPushOnStack);
});

function testPushOnStack() {
    var server = new HttpServer(100, false);
    spyOn(server, 'getStack').and.callThrough();
    spyOn(server.getStack(), 'push').and.callThrough();

    var info = {
        method: 'get',
        route: '/route',
        callable: function () {}
    };

    server.putToStack(info.method, info.route, info.callable);

    expect(server.getStack).toHaveBeenCalled();
    expect(server.getStack().push).toHaveBeenCalled();
    expect(server.getStack().length).toEqual(1);
}

// test .handleRoute and .requestHandler
