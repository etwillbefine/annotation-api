"use strict";

/**
 * @param {ApiRoute} apiRoute
 * @constructor
 */
function ErrorHandler(apiRoute) {

    /**
     * @param {Array|Error|{}} error
     * @param {string|null} redirect
     * @param req
     * @param res
     * @param {Function|null} next
     */
    this.handle = function(error, redirect, req, res, next) {
        var errors = (error instanceof Array) ? error : [ error ];

        if (apiRoute.useCustomErrorHandler) {
            apiRoute.callable(req, res, next, errors);
            return;
        }
        if (apiRoute.redirectErrorHandler) {
            var redirectRoute = apiRoute.redirectErrorHandler.replace('%message%', errors[0].message);
            redirectRoute = redirectRoute.replace('%code%', errors[0].code);

            res.redirect(redirectRoute);
            return;
        }
        if (redirect) {
            res.redirect(redirect);
            return;
        }

        res.json({ success: false, errors: errors });
    }

}

/**
 * @type {ErrorHandler}
 */
module.exports = ErrorHandler;
