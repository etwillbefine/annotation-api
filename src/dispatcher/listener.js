"use strict";

var RouteDispatcher = require('./dispatcher');

/**
 * @param app
 * @param {ApiRoute} apiRoute
 * @param {SecurityContext} securityContext
 * @constructor
 */
function RequestListener(app, apiRoute, securityContext) {

    var method = apiRoute.method.toLowerCase();

    this.bind = function() {
        app[method](apiRoute.route, this.onRequest.bind(this));
    };

    /**
     * @param request
     * @param response
     * @param {Function} next
     */
    this.onRequest = function (request, response, next) {
        new RouteDispatcher(request, response, next).dispatchTo(apiRoute, securityContext);
    };

}

/**
 * @type {RequestListener}
 */
module.exports = RequestListener;
