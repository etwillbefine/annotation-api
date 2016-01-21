"use strict";

var RouteDispatcher = require('../../src/dispatcher/dispatcher');

describe('request dispatcher', function() {
    it('should dispatch the request', testRequestDispatcher);
});

function testRequestDispatcher() {
    var dispatcher = new RouteDispatcher({}, {}, null);
    var securityContext = { applySecurity: function() {} };
    var apiRoute = { security: { enabled: true }};

    spyOn(dispatcher.getControllerAction(), 'handle').and.callThrough();
    spyOn(dispatcher.getControllerAction(), 'handleSecureRequest').and.callThrough();
    spyOn(dispatcher.getControllerAction(), 'parseRequest');
    spyOn(dispatcher.getControllerAction(), 'respond');
    spyOn(securityContext, 'applySecurity').and.callThrough();

    dispatcher.dispatchTo(apiRoute, securityContext);
    dispatcher.dispatchTo({}, null);

    expect(dispatcher.getControllerAction().handle).toHaveBeenCalled();
    expect(dispatcher.getControllerAction().handleSecureRequest).toHaveBeenCalled();
    expect(securityContext.applySecurity).toHaveBeenCalledWith(apiRoute, {}, jasmine.any(Function));
    expect(dispatcher.getControllerAction().parseRequest).toHaveBeenCalledTimes(1);
    expect(dispatcher.getControllerAction().respond).toHaveBeenCalledTimes(1);
}
