"use strict";

var APIGenerator = require('./src/generator');

/**
 * @param app express-framework or null
 * @param {Array|null} routes file-paths to routing-files
 * @param {Function|string} prefix
 * @param {Function|null} callback
 *
 * @return {APIGenerator}
 */
module.exports = function(app, routes, prefix, callback) {

    // backward compability
    var isPrefixCallback = typeof prefix == 'function';
    if (isPrefixCallback) {
        callback = prefix;
    }

    var generator = new APIGenerator(app, (isPrefixCallback) ? null : prefix);

    if (routes instanceof Array && routes.length > 0) {
        generator.generate(routes, function (count) {
            if (typeof callback == 'function') {
                callback(count);
            }
        });
    }

    return generator;
};
