"use strict";

var SecurityContext = require('../../src/security');
var SessionStorage = require('../../src/security/storage');
var AuthCheck = require('../../src/security/auth-check');

describe('security context', function () {
    it('should create a new session storage', testSessionStorage);
    it('should add custom authentication strategies', testCustomAuthenticator);
    it('should create a new auth check, when apply security', testAuthCheckCreation);
});

function testSessionStorage() {
    var context = new SecurityContext();

    expect(context.getSessionStorage()).toEqual(jasmine.any(SessionStorage));
    expect(context.getSessionStorage().hasStorage()).toBeFalsy();
}

function testCustomAuthenticator() {
    var customSecurity = function() {};
    var context = new SecurityContext({ custom_authenticator: customSecurity }, null);
    context.addCallable('another_authenticator', customSecurity);
    context.addCallable('invalid_authenticator', 'no method');

    expect(Object.keys(context.getCallables()).length).toEqual(2);
    expect(context.getCallables().custom_authenticator).toEqual(customSecurity);
    expect(context.getCallables().another_authenticator).toEqual(customSecurity);
    expect(context.getCallables().invalid_authenticator).not.toBeDefined();
}

function testAuthCheckCreation() {
    var context = new SecurityContext();

    expect(context.applySecurity({ security: {}})).toEqual(jasmine.any(AuthCheck));
}
