"use strict";

var ControllerAction = require('../../src/dispatcher/controller-action');
var PayloadParser = require('../../src/filter/parser');
var responseMock = { json: function() {} };
var requestMock = { query: { param: 'value' }, body: { param: 'value' }};
var routeMock = { query: { param: 'expected' }, body: { param: 'expected' }, callable: function() {}, method: 'get' };

describe('controller', function() {
    it('should parse the request and respond', testRouteHandling);
    it('should parse get and post parameters', testParserCalls);
    it('should respond or forward the request', testResponse);
});

function testRouteHandling() {
    var controller = new ControllerAction(requestMock);
    spyOn(controller, 'parseRequest').and.callThrough();
    spyOn(controller, 'respond');

    routeMock.method = 'get';
    controller.handle(routeMock);

    expect(controller.getParser()).toEqual(jasmine.any(PayloadParser));
    expect(controller.parseRequest).toHaveBeenCalled();
    expect(controller.respond).toHaveBeenCalled();
}

function testParserCalls() {
    var controller = new ControllerAction(requestMock);
    spyOn(controller, 'respond');
    spyOn(controller.getParser(), 'parsePayload');

    controller.handle(routeMock);
    routeMock.method = 'post';
    controller.handle(routeMock);

    expect(controller.respond)
        .toHaveBeenCalled();
    expect(controller.getParser().parsePayload)
        .toHaveBeenCalledTimes(3);
    expect(controller.getParser().parsePayload)
        .toHaveBeenCalledWith(routeMock.query, requestMock.query, 'get');
    expect(controller.getParser().parsePayload)
        .toHaveBeenCalledWith(routeMock.query, requestMock.query, 'get');
    expect(controller.getParser().parsePayload)
        .toHaveBeenCalledWith(routeMock.body, requestMock.body, 'post');
}

function testResponse() {
    var errorResponse = { getErrors: function() {} };
    var responses = [{ success: true }, errorResponse, errorResponse ];
    var controller = new ControllerAction(requestMock, responseMock);
    spyOn(routeMock, 'callable');
    spyOn(responseMock, 'json');
    spyOn(errorResponse, 'getErrors').and.callThrough();
    spyOn(controller, 'parseRequest').and.callThrough();
    spyOn(controller.getParser(), 'getResponse').and.callFake(function () {
        return responses.shift();
    });

    routeMock.method = 'post';
    controller.handle(routeMock);

    routeMock.method = 'get';
    controller.handle(routeMock);

    routeMock.useCustomErrorHandler = function() {};
    controller.handle(routeMock);

    expect(controller.parseRequest).toHaveBeenCalledTimes(3);
    expect(controller.getParser().getResponse).toHaveBeenCalledTimes(3);
    expect(routeMock.callable).toHaveBeenCalledTimes(2);
    expect(errorResponse.getErrors).toHaveBeenCalled();
    expect(responseMock.json).toHaveBeenCalledTimes(1);
}
