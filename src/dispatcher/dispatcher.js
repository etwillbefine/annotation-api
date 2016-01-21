"use strict";

var ControllerAction = require('./controller-action');

function RouteDispatcher(req, res, next) {

    /** @type {ControllerAction} */
    this.action = new ControllerAction(req, res, next);

    /**
     * @param {ApiRoute} apiRoute
     * @param {SecurityContext} securityContext
     */
    this.dispatchTo = function(apiRoute, securityContext) {
        if (apiRoute.security) {
            this.action.handleSecureRequest(apiRoute, securityContext);
            return;
        }

        this.action.handle(apiRoute);
    };

    /**
     * @returns {ControllerAction}
     */
    this.getControllerAction = function() {
        return this.action;
    };

}

/**
 * @type {RouteDispatcher}
 */
module.exports = RouteDispatcher;
