"use strict";

var PayloadParser = require('./parser');

function Controller(req, res, next) {

    var parser = new PayloadParser();
    var info = {};
    var method = 'get';

    this.handle = function(httpMethod, routeInfo) {
        method = httpMethod;
        info = routeInfo;

        this.parseRequest();
        this.respond();
    };

    this.parseRequest = function() {
        parser.parsePayload(info.query, req.query, 'get');

        if (method.toLowerCase() == 'post') {
            parser.parsePayload(info.body, req.body, 'post');
        }
    };

    this.respond = function() {
        var response = parser.getResponse();
        if (response.success) {
            info.callable(req, res, next);
            return;
        }

        res.json(response);
    };

}

/**
 * @type {Controller}
 */
module.exports = Controller;
