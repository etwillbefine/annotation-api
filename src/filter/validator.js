"use strict";

function Validator() {

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.minLength = function(constraint) {
        if (!constraint.getValue()) {
            return false;
        }

        var count = this.getContent()[0];
        return count <= constraint.getValue().length;
    };

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.maxLength = function(constraint) {
        if (!constraint.getValue()) {
            return false;
        }

        var count = this.getContent()[0];
        return count > constraint.getValue().length;
    };

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.regexp = function(constraint) {
        var valid = '/' + constraint.getValue() + '/';
        var rgx = new RegExp(valid, 'i');

        return rgx.test(constraint.getContent()[0]);
    };

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.equals = function(constraint) {
        return constraint.getValue() == constraint.getContent()[0];
    };

}

/**
 * @type {Validator}
 */
module.exports = Validator;
