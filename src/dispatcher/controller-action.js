"use strict";

var ErrorHandler = require('./error-handler');
var PayloadParser = require('./../filter/parser');

function ControllerAction(req, res, next) {

    var parser = new PayloadParser();
    /** @type {ApiRoute} */
    var apiRoute;

    /**
     * @param {ApiRoute} routeDefinition
     */
    this.handle = function(routeDefinition) {
        apiRoute = routeDefinition;

        this.parseRequest();
        this.respond();
    };

    this.parseRequest = function() {
        parser.parsePayload(apiRoute.query, req.query, 'get');

        if (apiRoute.method.toLowerCase() === 'post') {
            parser.parsePayload(apiRoute.body, req.body, 'post');
        }
    };

    this.respond = function() {
        var response = parser.getResponse();
        var isSuccessful = true === response.success;

        if (isSuccessful) {
            apiRoute.callable(req, res, next);
            return;
        }

        var errorHandler = new ErrorHandler(apiRoute);
        errorHandler.handle(response.getErrors(), null, req, res, next);
    };

    /**
     * @param {ApiRoute} apiRoute
     * @param {SecurityContext} securityContext
     */
    this.handleSecureRequest = function(apiRoute, securityContext) {
        securityContext.applySecurity(apiRoute, req, function(err, session, redirect) {
            /** @type {{auth: {error: *, authenticated: (boolean|*)}, session: *}} */
            req.api = {
                auth: { error: err, authenticated: (!err && session) },
                session: session
            };

            if (!err && session) {
                this.handle(apiRoute);
                return;
            }

            var errorHandler = new ErrorHandler(apiRoute);
            errorHandler.handle(err, redirect, req, res, next);
        }.bind(this));
    };

    /**
     * @returns {APIPayloadParser}
     */
    this.getParser = function() {
        return parser;
    };

}

/**
 * @type {ControllerAction}
 */
module.exports = ControllerAction;
