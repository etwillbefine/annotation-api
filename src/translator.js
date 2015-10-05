const ROUTE_ANNOTATION = 'Route';
const QUERY_ANNOTATION = 'Query';
const BODY_ANNOTATION = 'Body';
const METHOD_ANNOTATION = 'HTTP';
const SECURITY_ANNOTATION = 'Security';

function AnnotationTranslator() {
    "use strict";

    /**
     * @param {Array} annotations
     * @returns {{route: string, query: {}, body: {}, method: string, security: null}}
     */
    this.translate = function(annotations) {
        var data = {
            route: '',
            query: {},
            body: {},
            method: 'get',
            security: null
        };

        for (var r in annotations) {
            var comment = annotations[r];

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
 * @type {AnnotationTranslator}
 */
module.exports = AnnotationTranslator;
