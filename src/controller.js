"use strict";

var PayloadParser = require('./parser');

function Controller(req, res, next) {

    var parser = new PayloadParser();
    /** @type {ApiRoute} */
    var request;
    var method = 'get';

    /**
     * @param {string} httpMethod
     * @param {ApiRoute} apiRoute
     */
    this.handle = function(httpMethod, apiRoute) {
        method = httpMethod;
        request = apiRoute;

        this.parseRequest();
        this.respond();
    };

    this.parseRequest = function() {
        parser.parsePayload(request.query, req.query, 'get');

        if (method.toLowerCase() == 'post') {
            parser.parsePayload(request.body, req.body, 'post');
        }
    };

    this.respond = function() {
        var response = parser.getResponse();
        var isSuccessful = true == response.success;
        var hasCallback = typeof request.callable == 'function';
        if (!hasCallback) {
            res.json(response);
            return;
        }

        if (isSuccessful) {
            // dispatch to request callback
            request.callable(req, res, next);
        }
        else if (!isSuccessful && request.useCustomErrorHandler) {
            // dispatch to request callback, passing errors
            request.callable(req, res, response.getErrors());
        }
        else {
            // not successful and not using a custom error handler, sending error to client
            res.json(response);
        }
    };

    /**
     * @returns {APIPayloadParser}
     */
    this.getParser = function() {
        return parser;
    };

}

/**
 * @type {Controller}
 */
module.exports = Controller;
