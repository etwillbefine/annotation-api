"use strict";

var ApiGenerator = require('./generator/generator');
var RequestListener = require('./dispatcher/listener');
var SecurityContext = require('./security');
var HTTPServer = require('./http');
var path = require('path');

/**
 * @param {*|null} app
 * @param {string|null} prefix
 * @param {boolean|null} isEnabled
 * @constructor
 */
function AnnotationApi(app, prefix, isEnabled) {
    if (!app) {
        app = new HTTPServer(null, isEnabled).getApp();
    }

    var generator = new ApiGenerator(prefix);
    var securityContext = new SecurityContext();

    /**
     * @param {string|Array<string>} files
     * @param {Function|null} callback
     */
    this.generate = function(files, callback) {
        if (typeof files === 'string') {
            files = this.generateFilePaths(files);
        }

        generator.generate(files, function () {
            this.registerRoutes(generator.getRoutes());

            if (typeof callback === 'function') {
                callback(generator.getRoutes().length);
            }
        }.bind(this));
    };

    /**
     * @param {string} filePath
     * @returns {Array<string>}
     */
    this.generateFilePaths = function(filePath) {
        if (path.resolve(filePath) !== path.normalize(filePath)) {
            // going into "your" project root (where node_modules are located)
            filePath = path.normalize(__dirname + '/../../../' + filePath);
        }

        return require('glob').sync(filePath);
    };

    /**
     * @param {Array<ApiRoute>} routes
     */
    this.registerRoutes = function(routes) {
        routes.forEach(function (route) {
            new RequestListener(app, route, securityContext).bind();
        });
    };

    /**
     * @returns {SecurityContext}
     */
    this.getSecurityContext = function() {
        return securityContext;
    };

    /**
     * @param storageInterface
     */
    this.setSessionStorage = function(storageInterface) {
        securityContext.getSessionStorage().setStorage(storageInterface);
    };

    /**
     * @param {string} name
     * @param {Function} callable
     * @returns {boolean}
     */
    this.addSecurityMethod = function(name, callable) {
        return securityContext.addCallable(name, callable);
    };

    /**
     * @param {string} newPrefix
     */
    this.setApiPrefix = function(newPrefix) {
        generator.setApiPrefix(newPrefix);
    };

    /**
     * @returns {*}
     */
    this.getApp = function() {
        return app;
    };

    /**
     * @returns {APIGenerator}
     */
    this.getGenerator = function() {
        return generator;
    };

}

/**
 * @type {AnnotationApi}
 */
module.exports = AnnotationApi;
