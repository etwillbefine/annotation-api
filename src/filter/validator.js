"use strict";

function Validator() {

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.minLength = function(constraint) {
        var str = constraint.getContent()[0];
        if (!str) {
            return false;
        }

        return str.length >= constraint.getValue();
    };

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.maxLength = function(constraint) {
        var str = constraint.getContent()[0];
        if (!str) {
            return false;
        }

        return str.length <= constraint.getValue();
    };

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.regexp = function(constraint) {
        var rgx = new RegExp(constraint.getValue(), 'i');

        return rgx.test(constraint.getContent()[0]);
    };

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.equals = function(constraint) {
        return constraint.getValue() == constraint.getContent()[0];
    };

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.in = function(constraint) {
        return constraint.getValue().indexOf(constraint.getContent()[0]) != -1;
    };

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.notIn = function(constraint) {
        return constraint.getValue().indexOf(constraint.getContent()[0]) == -1;
    };

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.min = function(constraint) {
        return constraint.getContent()[0] >= constraint.getValue();
    };

    /**
     * @param {Constraint} constraint
     * @returns {boolean}
     */
    this.max = function(constraint) {
        return constraint.getContent()[0] <= constraint.getValue();
    };

}

/**
 * @type {Validator}
 */
module.exports = Validator;
