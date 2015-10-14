"use strict";

/**
 * @param req
 * @param {string} method
 * @constructor
 */
function RequestMapper(req, method) {

    var query = {};
    var body = {};

    this.map = function() {
        this.mapQuery();

        if (method == 'post') {
            this.mapBody();
        }
    };

    this.mapQuery = function() {
        var parts = req.url.split('?');
        if (!parts || !parts.length) {
            return;
        }

        var params = parts[1] ? parts[1].split('&') : null;
        if (!params || !params.length) {
            return;
        }

        for(var p in params) {
            var keyValue = params[p].split('=');
            query[keyValue[0]] = decodeURIComponent(keyValue[1]);
        }
    };

    this.mapBody = function() {

    };

    this.getBody = function() {

    };

    this.getQuery = function() {
        return query;
    };

}

/**
 * @type {RequestMapper}
 */
module.exports = RequestMapper;
