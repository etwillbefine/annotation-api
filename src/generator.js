const API_PREFIX = '/api';

var annotation = require('annotation');
var Controller = require('./controller');
var AnnotationTranslator = require('./translator');

function APIGenerator(app) {

    if (!app) {
        var HTTPServer = require('./http');
        app = new HTTPServer().getApp();
    }

    var count = 0;
    var translator = new AnnotationTranslator();

    /**
     * @param {Array} routes
     * @param {Function} callback
     */
    this.generate = function(routes, callback) {
        resolveAPIFile(0, routes, callback);
    };

    /**
     * @param routeInfo {{callable: Function,route: string, query: {}, body: {}, method: string, security: null}}
     */
    var prepareRoute = function(routeInfo) {
        var uri = API_PREFIX + routeInfo.route;
        var method = routeInfo.method.toLowerCase();

        app[method](uri, function(req, res, next) {
            var controller = new Controller(req, res, next);
            controller.handle(method, routeInfo);
        });
    };

    /**
     * @param {number} index
     * @param {Array} routes
     * @param {Function} callback
     */
    var resolveAPIFile = function(index, routes, callback) {
        if (index == routes.length) {
            callback(count);
            return;
        }

        annotation(routes[index], function (reader) {
            var comments = reader.comments.methods;
            var apiFile = require(routes[index]);

            for(var m in comments) {
                var routeInfo = translator.translate(comments[m]);
                routeInfo.callable = apiFile[m];

                count++;
                prepareRoute(routeInfo);
            }

            resolveAPIFile(++index, routes, callback);
        });
    };

    /**
     * returns express app or our built-in server app class HTTPApp
     * @returns {*}
     */
    this.getApp = function() {
        return app;
    };

    /**
     * @returns {string}
    **/
    this.getApiPrefix = function() {
	return API_PREFIX;
    };

}

/**
 * @type {APIGenerator}
 */
module.exports = APIGenerator;
