"use strict";

function ReferenceContainer() {

    var references = {};

    /**
     * @param {{}|*|any} reference
     * @param {string} name
     */
    this.addReference = function(reference, name) {
        references[name] = reference;
    };

    /**
     * @param {string} qualifier
     * @returns {*}
     */
    this.getReference = function(qualifier) {
        return references[qualifier];
    };

    /**
     * @returns {{}}
     */
    this.getReferences = function() {
        return references;
    };

    /**
     * @param obj
     * @param {string} referenceName
     * @returns {*}
     */
    this.mapFields = function(obj, referenceName) {
        var reference = this.getReference(referenceName);
        if (!reference) return obj;

        if (reference.__validation) {
            Object.keys(reference.__validation).forEach(function (key) {
                obj[key] = reference.__validation[key];
            });

            return obj;
        }

        for (var prop in reference) {
            if (reference.hasOwnProperty(prop)) {
                this.mapUnspecifiedField(obj, prop, reference[prop]);
            }
        }

        return obj;
    };

    /**
     * @param obj
     * @param {string} name
     * @param value
     * @return {*}
     */
    this.mapUnspecifiedField = function(obj, name, value) {
        var issetValue = (value !== null && typeof value !== 'undefined');

        obj[name] = {};
        obj[name].type = (issetValue && typeof value) || 'string';
        obj[name].required = issetValue;

        return obj;
    };

}

/**
 * @type {ReferenceContainer}
 */
module.exports = ReferenceContainer;
