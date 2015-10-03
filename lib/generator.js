const API_PREFIX = '/api';

const ROUTE_ANNOTATION = 'Route';
const QUERY_ANNOTATION = 'Query';
const BODY_ANNOTATION = 'Body';
const METHOD_ANNOTATION = 'HTTP';
const SECURITY_ANNOTATION = 'Security';

var annotation = require('annotation');
var PayloadParser = require('./parser');

function APIGenerator(app) {

    var count = 0;

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
            var parser = new PayloadParser();
            parser.parseRequest(routeInfo.query, req.query, 'get');

            if (method == 'post') {
                parser.parseRequest(routeInfo.body, req.body, 'post');
            }

            var response = parser.getResponse();
            if (response.success) {
                routeInfo.callable(req, res, next);
                return;
            }

            res.json(response);
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
                var routeInfo = getRouteInfo(comments[m]);
                routeInfo.callable = apiFile[m];

                count++;
                prepareRoute(routeInfo);
            }

            resolveAPIFile(++index, routes, callback);
        });
    };

    /**
     * @param {Array} comments
     * @returns {{route: string, payload: {}, method: string, security: null}}
     */
    var getRouteInfo = function(comments) {
        var data = {
            route: '',
            query: {},
            body: {},
            method: 'get',
            security: null
        };

        for (var r in comments) {
            var comment = comments[r];

            switch (comment.key) {
                case ROUTE_ANNOTATION:
                    data.route = comment.value;
                    break;
                case QUERY_ANNOTATION:
                    data.query = comment.value;
                    break;
                case BODY_ANNOTATION:
                    data.body = comment.value;
                    break;
                case METHOD_ANNOTATION:
                    data.method = comment.value;
                    break;
                case SECURITY_ANNOTATION:
                    data.security = comment.value;
                    break;
            }
        }

        return data;
    }

}

/**
 * @type {APIGenerator}
 */
module.exports = APIGenerator;
