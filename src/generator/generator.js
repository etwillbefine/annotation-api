"use strict";

var annotation = require('annotation');
var AnnotationTranslator = require('./translator');

/**
 * @param {string|null} prefix
 * @param {ReferenceContainer} referenceContainer
 * @constructor
 */
function APIGenerator(prefix, referenceContainer) {

    var translator = new AnnotationTranslator(referenceContainer);
    var appPrefix = prefix || '/api';
    var routes = [];

    /**
     * @param {Array<string>} files
     * @param {Function} callback
     */
    this.generate = function(files, callback) {
        this.generateRoutes(0, files, callback);
    };

    /**
     * @param {number} index
     * @param {Array<string>} files
     * @param {Function} callback
     */
    this.generateRoutes = function(index, files, callback) {
        if (index === files.length) {
            callback(routes.length);
            return;
        }

        this.translateFiles(files[index], function (list) {
            routes = routes.concat(list);

            this.generateRoutes(++index, files, callback);
        }.bind(this));
    };

    /**
     * @param {string} file
     * @param {Function} callback
     */
    this.translateFiles = function (file, callback) {
        annotation(file, function (reader) {
            var comments = reader.comments.methods;
            var apiFile = require(file);
            var apiRoutes = [];

            Object.keys(comments).forEach(function (action) {
                var routeInfo = translator.translate(comments[action]);
                routeInfo.route = appPrefix + routeInfo.route;
                routeInfo.callable = apiFile[action];

                apiRoutes.push(routeInfo);
            });

            callback(apiRoutes);
        });
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
     * @returns {Array<ApiRoute>}
     */
    this.getRoutes = function() {
        return routes;
    };

}

/**
 * @type {APIGenerator}
 */
module.exports = APIGenerator;
