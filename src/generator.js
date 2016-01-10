"use strict";

var annotation = require('annotation');
var Controller = require('./controller');
var AnnotationTranslator = require('./translator');
var SecurityContext = require('./security');

/**
 * @param {*|null} app
 * @param {string|null} prefix
 * @param {boolean} isEnabled only for test usage
 * @constructor
 */
function APIGenerator(app, prefix, isEnabled) {

    if (!app && isEnabled !== false) {
        var HTTPServer = require('./http');
        app = new HTTPServer().getApp();
    }

    var count = 0;
    var security = new SecurityContext({}, null);
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
            /** @type {{}} */
            req.api = {};

            var controller = new Controller(req, res, next);
            if (!routeInfo.security) {
                controller.handle(method, routeInfo);
                return;
            }

            security.applySecurity(routeInfo, req, function(err, session, redirect) {
                if (!err && session) {
                    /** @type {{}|*|null} */
                    req.api.session = session;
                    controller.handle(method, routeInfo);
                    return;
                }

                /** @type {{error: *, session: *}} */
                req.api.auth = { error: err, session: session };
                if (routeInfo.useCustomErrorHandler) {
                    routeInfo.callable(req, res, next, err);
                    return;
                }
                if (redirect) {
                    res.redirect(redirect.split('?').shift() + '?err=' + (err.code || encodeURIComponent(err.message)));
                    return;
                }
                if (typeof next == 'function') {
                    next(JSON.stringify(err));
                    return;
                }

                res.json(JSON.stringify(err));
            });
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

    /**
     * @returns {SecurityContext}
     */
    this.getSecurityContext = function() {
        return security;
    };

    /**
     * @param storageInterface
     */
    this.setSessionStorage = function(storageInterface) {
        security.getSessionStorage().setStorage(storageInterface);
    };

    /**
     * @param {string} name
     * @param {Function} callable
     * @returns {boolean}
     */
    this.addSecurityMethod = function(name, callable) {
        return security.addCallable(name, callable);
    };

    /**
     * @type {resolveAPIFile}
     */
    this.resolveAPIFile = resolveAPIFile;
}

/**
 * @type {APIGenerator}
 */
module.exports = APIGenerator;
