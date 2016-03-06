const ROUTE_ANNOTATION = 'Route';
const QUERY_ANNOTATION = 'Query';
const BODY_ANNOTATION = 'Body';
const METHOD_ANNOTATION = 'HTTP';
const SECURITY_ANNOTATION = 'Security';
const CUSTOM_ERROR_HANDLER = 'CustomErrorHandler';
const REDIRECT_ERROR_HANDLER = 'RedirectErrorHandler';
const RESPONSE_ANNOTATION = 'Response';
const APPEND_PAYLOAD = 'Append';
const DOC_ANNOTATION = 'Doc';
var ApiRoute = require('./../model/route');
var Response = require('./../model/response');

/**
 * @param {ReferenceContainer} referenceContainer
 * @constructor
 */
function AnnotationTranslator(referenceContainer) {
    "use strict";

    /**
     * @param annotations
     * @param {boolean} hiddenFields
     * @returns {ApiRoute}
     * @throws {Error}
     */
    this.translate = function(annotations, hiddenFields) {
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
                    data.method = comment.value.toLowerCase();
                    break;
                case CUSTOM_ERROR_HANDLER:
                    data.useCustomErrorHandler = true;
                    break;
                case REDIRECT_ERROR_HANDLER:
                    data.redirectErrorHandler = comment.value;
                    break;
                case SECURITY_ANNOTATION:
                    data.security = comment.value;
                    break;
                case RESPONSE_ANNOTATION:
                    if (!hiddenFields) return;
                    data.possibleResponses.push(new Response().map(comment.value));
                    break;
                case DOC_ANNOTATION:
                    if (!hiddenFields) return;
                    data.description = comment.value && comment.value + '\n\n';
                    break;
                case APPEND_PAYLOAD:
                    var reference = comment.value.split('.');
                    if (reference.pop() !== 'class') {
                        throw new Error('Append must provide a class name. Example: my_namespace.my_class.class');
                    }

                    data.body = referenceContainer.mapFields(data.body, reference.join('.'));
                    break;
            }
        }.bind(this));

        return data;
    };

}

/**
 * @type {AnnotationTranslator}
 */
module.exports = AnnotationTranslator;
