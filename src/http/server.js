"use strict";

var ResponsePrototype = require('./response');
var RequestMapper = require('./mapper');

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

    /**
     * @param req
     * @param res
     */
    function requestHandler(req, res) {
        var url = req.url.split('?')[0];
        var method = req.method.toLowerCase();
        
        ResponsePrototype.prototype = res;
        res = new ResponsePrototype(res);

        for(var item in stack) {
            if (!stack.hasOwnProperty(item)) {
                continue;
            }

            if (handleRoute(stack[item], req, res, url, method)) {
                return;
            }
        }

        res.json({
            errors: [ { error: 'route_not_found', code: 404 } ],
            request: { route: url, method: method }
        });
    }

    /**
     * @param route
     * @param req
     * @param res
     * @param url
     * @param method
     * @return {boolean}
     */
    function handleRoute(route, req, res, url, method) {        
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

}

/**
 * @type {HTTPServer}
 */
module.exports = HTTPServer;
