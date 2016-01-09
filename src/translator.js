const ROUTE_ANNOTATION = 'Route';
const QUERY_ANNOTATION = 'Query';
const BODY_ANNOTATION = 'Body';
const METHOD_ANNOTATION = 'HTTP';
const SECURITY_ANNOTATION = 'Security';
const CUSTOM_ERROR_HANDLER = 'CustomErrorHandler';
var ApiRoute = require('./route');

function AnnotationTranslator() {
    "use strict";

    /**
     * @param annotations
     * @returns {ApiRoute}
     */
    this.translate = function(annotations) {
        var data = new ApiRoute();

        annotations.forEach(function (comment) {
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
                case CUSTOM_ERROR_HANDLER:
                    data.useCustomErrorHandler = true;
                    break;
                case SECURITY_ANNOTATION:
                    data.security = comment.value;
                    break;
            }
        });

        return data;
    }

}

/**
 * @type {AnnotationTranslator}
 */
module.exports = AnnotationTranslator;
