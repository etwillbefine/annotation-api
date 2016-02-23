"use strict";

function Response() {

    this.status = 200;
    this.json = null;
    this.xml = null;
    this.plain = null;
    this.redirect = null;
    this.contentType = null;

    /**
     * @param json
     * @returns {Response}
     */
    this.map = function(json) {
        for (var prop in json) {
            if (json.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
                this[prop] = json[prop];
            }
        }

        return this;
    };

}

/**
 * @type {Response}
 */
module.exports = Response;
