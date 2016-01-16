"use strict";

var HTTPServer = require('./server');

/**
 * @param {number} port
 * @param {boolean} enabled
 * @constructor
 */
function HTTPApp(port, enabled) {

    var server = new HTTPServer(port, enabled);

    this.get = resolve.bind({ method: 'get', server: server });
    this.post = resolve.bind({ method: 'post', server: server  });
    this.put = resolve.bind({ method: 'put', server: server });
    this.head = resolve.bind({ method: 'head', server: server });
    this.delete = resolve.bind({ method: 'delete', server: server });

    /**
     * @returns {HTTPServer}
     */
    this.getHTTPServer = function() {
        return server;
    };

}

function resolve(route, callback) {
    this.server.putToStack(this.method, route, callback);
}

/**
 * @method {HTTPApp}
 */
module.exports = HTTPApp;
