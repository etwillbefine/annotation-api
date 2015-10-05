"use strict";

var Constraint = require('./constraint');
var Validator = require('./validator');

/**
 * @returns {Function}
 */
module.exports = function() {
    var defaults = {};
    var validator = new Validator();

    for(var d in validator) {
        if (!validator.hasOwnProperty(d) || typeof validator[d] != 'function') {
            continue;
        }

        defaults[d] = validator[d];
    }

    return function(constraintName) {
        var constraint = new Constraint();
        constraint.validate = defaults[constraintName];

        return constraint;
    };
};
