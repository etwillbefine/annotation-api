"use strict";

var SessionStroage = require('./storage');
var AuthCheck = require('./auth-check');

/**
 * @param {{}|null} callables
 * @param {{}|null} sessionInterface
 * @constructor
 */
function SecurityContext(callables, sessionInterface) {
    if (!callables) {
        callables = {};
    }

    var storage = new SessionStroage(sessionInterface);

    /**
     * @param {ApiRoute} route
     * @param request
     * @param {Function} callback
     * @returns {AuthCheck}
     */
    this.applySecurity = function(route, request, callback) {
        var authCheck = new AuthCheck(storage, request, callables, callback);
        authCheck.isAuthenticated(route.security);

        return authCheck;
    };

    /**
     * @returns {{}}
     */
    this.getCallables = function() {
        return callables;
    };

    /**
     * @param {string} name
     * @param {Function} callable
     * @returns {boolean}
     */
    this.addCallable = function(name, callable) {
        if (typeof callable != 'function') {
            return false;
        }

        callables[name] = callable;
        return true;
    };

    /**
     * @returns {SessionStorage}
     */
    this.getSessionStorage = function() {
        return storage;
    };
}

/**
 * @type {SecurityContext}
 */
module.exports = SecurityContext;
