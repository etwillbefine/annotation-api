"use strict";

function ClassReferenceContainer() {

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

}

/**
 * @type {ClassReferenceContainer}
 */
module.exports = ClassReferenceContainer;
