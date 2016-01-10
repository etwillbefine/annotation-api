"use strict";

var AuthCheck = require('../../src/security/auth-check');

describe('auth validation check', function () {
    it('should check, whether the session contains properties', testSessionContains);
    it('should use request.session when exists', testRequestSession);
});

function testSessionContains(done) {
    var request = { session: { my_session: { id: '12345' } }};
    var properties = { id: { type: 'string', rules: { regexp: '^[0-9]{5}$' }}};
    var authMethod = { method: 'session_contains', session: 'my_session', properties: properties };
    var check = new AuthCheck(null, request, null, null);

    var resolve = function (err, session) {
        expect(session).toBeDefined();
        expect(err).toEqual(null);

        authMethod.properties.id.rules.regexp = '^[0-9]{10}$';
        check.validateSessionContains(authMethod, reject);
    };

    var reject = function (err, session) {
        expect(err).toEqual(jasmine.any(Object));
        expect(session).toBeDefined();

        done();
    };

    check.validateSessionContains(authMethod, resolve);
}

function testRequestSession(done) {
    var request = { session: { my_session: {} }};
    var check = new AuthCheck(null, request, null, function (err, session) {
        expect(err).toEqual(null);
        expect(session).toEqual(request.session.my_session);

        done();
    });

    check.isAuthenticated({ method: 'session_exists', session: 'my_session' });
}
