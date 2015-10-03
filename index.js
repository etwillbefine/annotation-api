"use strict";

/**
 * @param app express-framework
 * @param {Array} routes file-paths to routing-files
 * @param {Function|null} callback
 */
module.exports = function(app, routes, callback) {

    var APIGenerator = require('./lib/generator');
    var generator = new APIGenerator(app);

    generator.generate(routes, function(count) {
	    console.log('API initialized with ' + count + ' routes.');

        if (typeof callback == 'function') {
            callback();
        }
    });

};
