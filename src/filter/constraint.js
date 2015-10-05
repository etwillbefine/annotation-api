"use strict";

function Constraint() {

    var content = [];
    var value;

    this.validate = null;

    /**
     * @param newValue
     * @returns {Constraint}
     */
    this.setValue = function(newValue) {
        value = newValue;
        return this;
    };

    /**
     * @returns {*}
     */
    this.getContent = function() {
        return content;
    };

    /**
     * @returns {*}
     */
    this.getValue = function() {
        return value;
    };

    /**
     * @param item
     * @returns {Constraint}
     */
    this.addContent = function(item) {
        content.push(item);
        return this;
    };

}

/**
 * @type {Constraint}
 */
module.exports = Constraint;
