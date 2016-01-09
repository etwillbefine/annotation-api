"use strict";

var annotation = require('annotation');
var Controller = require('./controller');
var AnnotationTranslator = require('./translator');

/**
 * @param {*|null} app
 * @param {string|null} prefix
 * @constructor
 */
function APIGenerator(app, prefix) {

    if (!app) {
        var HTTPServer = require('./http');
        app = new HTTPServer().getApp();
    }

    var count = 0;
    var translator = new AnnotationTranslator();
    var appPrefix = prefix || '/api';

    /**
     * @param {Array} routes
     * @param {Function} callback
     */
    this.generate = function(routes, callback) {
        this.resolveAPIFile(0, routes, callback);
    };

    /**
     * @param {ApiRoute} routeInfo
     */
    var prepareRoute = function(routeInfo) {
        var uri = appPrefix + routeInfo.route;
        var method = routeInfo.method.toLowerCase();

        // bind route on app
        app[method](uri, function (req, res, next) {
            var controller = new Controller(req, res, next);
            controller.handle(method, routeInfo);
        });
    };

    /**
     * @param {number} index
     * @param {Array} routes
     * @param {Function} callback
     */
    var resolveAPIFile = function (index, routes, callback) {
        if (index == routes.length) {
            callback(count);
            return;
        }

        annotation(routes[index], function (reader) {
            var comments = reader.comments.methods;
            var apiFile = require(routes[index]);

            for(var m in comments) {
                if (!comments.hasOwnProperty(m)) {
                    continue;
                }

                // bind the callback on translated route
                var routeInfo = translator.translate(comments[m]);
                routeInfo.callable = apiFile[m];

                count++;
                prepareRoute(routeInfo);
            }

            resolveAPIFile(++index, routes, callback);
        });
    };

    /**
     * returns express app or our built-in server app class HTTPApp
     * @returns {*|HTTPApp}
     */
    this.getApp = function() {
        return app;
    };

    /**
     * @returns {string}
     */
    this.getApiPrefix = function() {
	    return appPrefix;
    };

    /**
     * @param {string} newValue
     * @returns {APIGenerator}
     */
    this.setApiPrefix = function(newValue) {
        appPrefix = newValue;
        return this;
    };

    /**
     * @returns {number}
     */
    this.getCount = function() {
        return count;
    };

    this.resolveAPIFile = resolveAPIFile;
}

/**
 * @type {APIGenerator}
 */
module.exports = APIGenerator;
