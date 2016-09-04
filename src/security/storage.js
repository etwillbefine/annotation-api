"use strict";

function SessionStorage(sessionInterface) {

    /**
     * @param {string} sessionName
     * @param {Function} callback
     */
    this.getSession = function(sessionName, callback) {
        if (!sessionInterface) {
            callback(new Error('Cannot get session. No session storage found.'));
            return;
        }

        if (sessionInterface.get.length > 1) {
            sessionInterface.get(sessionName, callback);
            return;
        }

        var query = sessionInterface.get(sessionName);
        if (query && typeof query.then === 'function' && typeof query.catch === 'function') {
            query.then(function (result) { callback(null, result) });
            query.catch(function (err) { callback(err, null); });
            return;
        }

        if (query && typeof query.exec === 'function') {
            query.exec(callback);
            return;
        }

        // Treat query as result
        callback(null, query);
    };

    /**
     * @param {{get: Function}|*} newSessionInterface
     */
    this.setStorage = function(newSessionInterface) {
        sessionInterface = newSessionInterface;
    };

    /**
     * @returns {{get: Function}|*}
     */
    this.getStorage = function() {
        return sessionInterface;
    };

    /**
     * @returns {boolean}
     */
    this.hasStorage = function() {
        return sessionInterface && typeof sessionInterface.get === 'function';
    };
}

/**
 * @type {SessionStorage}
 */
module.exports = SessionStorage;
