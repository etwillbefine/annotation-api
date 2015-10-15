"use strict";

/**
 * @param req
 * @param {string} method
 * @constructor
 */
function RequestMapper(req, method) {

    var query = {};
    var body = {};
    var bodyChunks = '';
    var onFinished;

    this.map = function() {
        this.mapQuery();

        if (method == 'post') {
            this.readBody();

            req.on('end', function() {
                this.mapBody();
                mapped();
            }.bind(this));
            return;
        }

        mapped();
    };

    function mapped() {
        if (typeof onFinished == 'function') {
            onFinished();
        }
    }

    this.mapQuery = function() {
        var parts = req.url.split('?');
        if (!parts || !parts.length) {
            return;
        }

        var params = parts[1] ? parts[1].split('&') : null;
        query = getObject(params);
    };

    this.readBody = function() {
        req.on('data', function(data) {
            bodyChunks += data;

            if (bodyChunks.length > 5140) {
                req.connection.destroy();
            }
        });
    };

    this.mapBody = function() {
        try {
            body = JSON.parse(bodyChunks);
        }
        catch (e) {
            var params = bodyChunks.split('&');
            body = getObject(params);
        }
    };

    this.getBody = function() {
        return body;
    };

    this.getPlainBody = function() {
        return bodyChunks;
    };

    this.getQuery = function() {
        return query;
    };

    this.setOnFinished = function(callback) {
        onFinished = callback;
    };

    /**
     * @param params
     * @returns {*}
     */
    function getObject(params) {
        if (!params || !params.length) {
            return null;
        }

        var obj = {};
        for(var p in params) {
            var keyValue = params[p].split('=');
            obj[keyValue[0]] = decodeURIComponent(keyValue[1]);
        }

        return obj;
    }

}

/**
 * @type {RequestMapper}
 */
module.exports = RequestMapper;
