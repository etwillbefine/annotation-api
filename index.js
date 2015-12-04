"use strict";

/**
 * @param app express-framework or null
 * @param {Array|null} routes file-paths to routing-files
 * @param {Function|null} callback
 *
 * @return {APIGenerator}
 */
module.exports = function(app, routes, callback) {

    var APIGenerator = require('./src/generator');
    var generator = new APIGenerator(app);

    if (routes instanceof Array && routes.length > 0) {
        generator.generate(routes, function (c) {console.log(c);
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    return generator;
};
