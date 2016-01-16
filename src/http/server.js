"use strict";

var ResponsePrototype = require('./response');
var RequestMapper = require('./mapper');
var http = require('http');

/**
 * @param {number|null} port default 3000
 * @param {boolean} enabled default true
 * @constructor
 */
function HTTPServer(port, enabled) {

    if (enabled !== false) {
        var server = http.createServer(this.requestHandler);
        server.listen(port || 3000);
    }

    /** @type {Array} **/
    var stack = [];

    /**
     * @param req
     * @param res
     */
    this.requestHandler = function(req, res) {
        var url = req.url.split('?')[0];
        var method = req.method.toLowerCase();
        
        ResponsePrototype.prototype = res;
        res = new ResponsePrototype(res);

        for(var r = 0; r < stack.length; r++) {
            if (this.handleRoute(stack[r], req, res, url, method)) {
                return;
            }
        }

        res.json({
            errors: [ { error: 'route_not_found', code: 404 } ],
            request: { route: url, method: method }
        });
    };

    /**
     * @param route
     * @param req
     * @param res
     * @param url
     * @param method
     * @return {boolean}
     */
    this.handleRoute = function(route, req, res, url, method) {
        if (route.route != url || route.method != method) {
            return false;
        }
        
        var mapper = new RequestMapper(req, method);
        mapper.setOnFinished(function() {
            req.body = mapper.getBody();
            req.query = mapper.getQuery();
            route.callable(req, res);
        });

        mapper.map();
        return true;
    };

    /**
     * @param method
     * @param route
     * @param callback
     */
    this.putToStack = function(method, route, callback) {
        this.getStack().push({
            method: method.toLowerCase(),
            route: route,
            callable: callback
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

    /**
     * @returns {Array}
     */
    this.getStack = function() {
        return stack;
    };

}

/**
 * @type {HTTPServer}
 */
module.exports = HTTPServer;
