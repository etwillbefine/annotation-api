"use strict";

var ResponsePrototype = require('./response');

/**
 * @param {number|null} port default 3000
 * @constructor
 */
function HTTPServer(port) {

    var http = require('http');
    var server = http.createServer(requestHandler);
    server.listen(port);

    /** @type {Array} **/
    var stack = [];

    function requestHandler(req, res) {
        var url = req.url.split('?')[0];
        var method = req.method.toLowerCase();
        ResponsePrototype.prototype = res;
        res = new ResponsePrototype(res);

        for(var item in stack) {
            if (!stack.hasOwnProperty(item)) {
                continue;
            }

            var route = stack[item];
            if (route.route == url && route.method == method) {
                route.callback(req, res);
                break;
            }
        }

        // 404
    }

    /**
     * @param method
     * @param route
     * @param callback
     */
    this.putToStack = function(method, route, callback) {
        stack.push({
            method: method.toLowerCase(),
            route: route,
            callback: callback
        });
    };

    /**
     * @returns {number|null}
     */
    this.getPort = function() {
        return port;
    };

    this.getServer = function() {
        return server;
    };

}

/**
 * @type {HTTPServer}
 */
module.exports = HTTPServer;
