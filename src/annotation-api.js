"use strict";

var ApiGenerator = require('./generator/generator');
var RequestListener = require('./dispatcher/listener');
var SecurityContext = require('./security');
var ReferenceContainer = require('./references');
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

    var container = new ReferenceContainer();
    var generator = new ApiGenerator(prefix, container);
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
        if (filePath === './' || path.resolve(filePath) !== path.normalize(filePath)) {
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

    /**
     * The referenced object must provide "public" properties with default values.
     * if (reference[property] === null || typeof reference[property] === 'undefined') returns true the "required" option will be disabled
     * result of typeof reference[property] will be used as type hint (default: string).
     *
     * If you want to define custom validators for the referenced object, you can add a public property named __validation
     * __validation can contain an object same as the passed objects to @Body or @Query annotation.
     * Whenever adding this property, no further (or regular) rules will be applied expect fields added with @Body annotation.
     *
     * Please note:
     *  All rules or fields from your referenced object will be applied as "body payload".
     *  Nested objects in your referenced object will be ignored and simplified to "type=object"
     *  Usage: @Append("{name}.class");
     *
     * @param {{}|any} reference
     * @param {string} name
     */
    this.addReference = function(reference, name) {
        container.addReference(reference, name);
    };

}

/**
 * @type {AnnotationApi}
 */
module.exports = AnnotationApi;
