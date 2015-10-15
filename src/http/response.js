"use strict";

/**
 * @param res
 * @constructor
 */
function ResponsePrototype(res) {

    this.json = function(response) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    };

    this.send = function(response) {
        res.setHeader('Content-Type', 'text/plain');
        res.end(response);
    };

}

/**
 * @type {ResponsePrototype}
 */
module.exports = ResponsePrototype;
