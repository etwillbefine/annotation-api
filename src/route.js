"use strict";

function ApiRoute() {

    /** @type {string} */
    this.route = '';

    /** @type {{}} */
    this.query = {};

    /** @type {{}} */
    this.body = {};

    /** @type {string} */
    this.method = 'get';

    /** @type {null|Function} */
    this.security = null;

    /** @type {null|Function} */
    this.callable = null;

    /** @type {boolean} */
    this.useCustomErrorHandler = false;

    /** @type {null} */
    this.redirectErrorHandler = '';

}

/**
 * @type {ApiRoute}
 */
module.exports = ApiRoute;
