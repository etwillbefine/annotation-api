const SESSION_EXISTS_METHOD = 'session_exists';
const SESSION_CONTAINS_METHOD = 'session_contains';

var Parser = require('../filter/parser');

/**
 * @param {SessionStorage} storage
 * @param request
 * @param {{}|null} callables
 * @param {Function} callback
 * @constructor
 */
function AuthCheck(storage, request, callables, callback) {
    "use strict";

    /**
     * @param {*|{method: string, session: string, properties: {}|null|string, authenticator: string|null}} authMethod
     */
    this.isAuthenticated = function(authMethod) {
        if (typeof authMethod === 'string') {
            if (!this.callBehaviour(authMethod, callback)) {
                callback(new Error('Cannot check authentication. Auth method ' + authMethod + ' was not found.'));
            }
            return;
        }

        switch (authMethod.method) {
            case SESSION_EXISTS_METHOD:
                this.validateExistingSession(authMethod, callback);
                break;
            case SESSION_CONTAINS_METHOD:
                this.validateSessionContains(authMethod, callback);
                break;
        }
    };

    /**
     * @param authMethod
     * @param {Function} resolve
     */
    this.validateExistingSession = function(authMethod, resolve) {
        if (authMethod.authenticator) {
            var isAuthenticator = this.callBehaviour(authMethod.authenticator, function (err, session) {
                resolve(err, session);
            });

            if (isAuthenticator) {
                return;
            }
        }

        if (request && typeof request.session == 'object') {
            var issetSession = authMethod.session && request.session[authMethod.session];
            var error = (issetSession) ? null : { message: 'Missing session ' + authMethod.session, code: 405 };

            resolve(error, request.session[authMethod.session]);
            return;
        }

        if (storage.hasStorage()) {
            storage.getSession(authMethod.session, resolve);
            return;
        }

        callback(new Error('Missing authentication method or invalid session name.'));
    };

    /**
     * @param authMethod
     * @param {Function} resolve
     */
    this.validateSessionContains = function(authMethod, resolve) {
        this.validateExistingSession(authMethod, function (err, session) {
            if (err || !session) {
                resolve((err) ? err : { message: 'Missing session ' + authMethod.session, code: 405 }, session);
                return;
            }

            if (!this.validateProperties(authMethod, session)) {
                resolve({ message: 'Session does not match the required rules.', code: 400 }, session);
                return;
            }

            resolve(null, session);
        }.bind(this));
    };

    /**
     * @param authMethod
     * @param session
     * @returns {boolean}
     */
    this.validateProperties = function(authMethod, session) {
        var parser = new Parser();

        for(var prop in authMethod.properties) {
            if (!authMethod.properties.hasOwnProperty(prop)) {
                continue;
            }

            if (!session.hasOwnProperty(prop)) {
                return false;
            }

            var validation = authMethod.properties[prop];
            if (validation.type) {
                if (!parser.validateType(validation.type, session[prop])) {
                    return false;
                }
            }
            if (validation.rules) {
                if (!parser.validateRules(validation.rules, session[prop])) {
                    return false;
                }
            }
        }

        return true;
    };

    /**
     * @param {string} authMethod
     * @param {Function} resolve
     * @returns {boolean}
     */
    this.callBehaviour = function(authMethod, resolve) {
        if (typeof callables[authMethod] != 'function') {
            return false;
        }

        callables[authMethod](request, resolve);
        return true;
    };

    /**
     * @returns {*}
     */
    this.getRequest = function() {
        return request;
    };

}

/**
 * @type {AuthCheck}
 */
module.exports = AuthCheck;
