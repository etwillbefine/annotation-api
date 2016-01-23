"use strict";

var AnnotationApi = require('./src/annotation-api');

/**
 * @param app express-framework or null
 * @param {Array|string|null} routes file-paths to routing-files
 * @param {Function|string} prefix
 * @param {Function|null} callback
 * @return {AnnotationApi}
 */
module.exports = function(app, routes, prefix, callback) {
    var isPrefixCallback = typeof prefix === 'function';
    var api = new AnnotationApi(app, (!isPrefixCallback) ? prefix : null, true);

    if (routes && routes.length) {
        api.generate(routes, (isPrefixCallback) ? prefix : callback);
    }

    return api;
};
