"use strict";

var ErrorHandler = require('../../src/dispatcher/error-handler');
var routeMock = {};

describe('error handler', function() {
    it('should call the custom error handler', testCustomErrorHandler);
    it('should call the error error handler', testRedirectErrorHandler);
    it('should redirect when redirect was forced', testRedirectCall);
});

function testCustomErrorHandler() {
    routeMock.useCustomErrorHandler = true;
    routeMock.callable = function() {};
    var handler = new ErrorHandler(routeMock);
    spyOn(routeMock, 'callable');

    handler.handle([ 'myerror' ], null, {}, {}, null);

    expect(routeMock.callable).toHaveBeenCalledWith(
        {}, {}, null, [ 'myerror' ]
    );
}

function testRedirectErrorHandler() {
    routeMock.useCustomErrorHandler = false;
    routeMock.redirectErrorHandler = '/redirect/%code%/%message%';
    var response = { redirect: function() {} };
    var handler = new ErrorHandler(routeMock);
    spyOn(response, 'redirect');

    handler.handle({ code: 123, message: 'abc' }, null, {}, response, null);

    expect(response.redirect).toHaveBeenCalledWith('/redirect/123/abc');
}

function testRedirectCall() {
    var response = { redirect: function() {} };
    var handler = new ErrorHandler({});
    spyOn(response, 'redirect');

    handler.handle([], '/go-away', {}, response, null);

    expect(response.redirect).toHaveBeenCalledWith('/go-away');
}
