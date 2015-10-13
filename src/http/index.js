"use strict";

var HTTPApp = require('./app');

/**
 * @param {number|null} port default 3000
 * @constructor
 */
function CustomServer(port) {
    if (!port || port < 0) {
        port = 3000;
    }

    var app = new HTTPApp(port);

    /**
     * @returns {HTTPApp}
     */
    this.getApp = function() {
        return app;
    };

}

/**
 * @type {CustomServer}
 */
module.exports = CustomServer;
