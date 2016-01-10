"use strict";

var AuthCheck = require('../../src/security/auth-check');

describe('auth check process', function () {
    it('should throw an error, when authenticate method is a string and no custom authenticator available', testBehaviourWithCustomAuth);
    it('should call validation methods, when authMethod is properly defined', testBehaviourWithoutCustomAuth);
});

function testBehaviourWithCustomAuth() {
    var check = new AuthCheck();

    expect(function() { check.isAuthenticated(null) }).toThrow(jasmine.any(Error));

    check = new AuthCheck(null, null, { my_callable: function() {}}, null);
    spyOn(check, 'callBehaviour').and.returnValue(true);

    expect(function() { check.isAuthenticated('my_callable'); }).not.toThrow(jasmine.any(Error));
    expect(check.callBehaviour).toHaveBeenCalled();
}

function testBehaviourWithoutCustomAuth() {
    var callback = function() {};
    var check = new AuthCheck(null, null, null, callback);
    var authMethod = { method: 'session_exists' };
    spyOn(check, 'validateSessionContains').and.callThrough();
    spyOn(check, 'validateExistingSession');
    spyOn(check, 'callBehaviour');

    check.isAuthenticated(authMethod);
    expect(check.validateExistingSession).toHaveBeenCalledWith(authMethod, callback);

    authMethod = { method: 'session_contains' };
    check.isAuthenticated(authMethod);

    expect(check.validateSessionContains).toHaveBeenCalledWith(authMethod, callback);
    expect(check.validateExistingSession).toHaveBeenCalledTimes(2);
    expect(check.callBehaviour).not.toHaveBeenCalled();
}
