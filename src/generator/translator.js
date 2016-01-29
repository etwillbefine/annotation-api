const ROUTE_ANNOTATION = 'Route';
const QUERY_ANNOTATION = 'Query';
const BODY_ANNOTATION = 'Body';
const METHOD_ANNOTATION = 'HTTP';
const SECURITY_ANNOTATION = 'Security';
const CUSTOM_ERROR_HANDLER = 'CustomErrorHandler';
const REDIRECT_ERROR_HANDLER = 'RedirectErrorHandler';
const RESPONSE_ANNOTATION = 'Response';
const APPEND_PAYLOAD = 'Append';
var ApiRoute = require('./../route');

/**
 * @param {ClassReferenceContainer} referenceContainer
 * @constructor
 */
function AnnotationTranslator(referenceContainer) {
    "use strict";

    /**
     * @param annotations
     * @returns {ApiRoute}
     * @throws {Error}
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
                    data.possibleResponses.push(comment.value);
                    break;
                case APPEND_PAYLOAD:
                    var reference = comment.value.split('.');
                    if (reference.pop() !== 'class') {
                        throw new Error('Append must provider a class name. Example: my_namespace.my_class.class');
                    }

                    this.applyReferencedObject(data, reference.join('.'));
                    break;
            }
        }.bind(this));

        return data;
    };

    /**
     * @param {ApiRoute} data
     * @param {string} name default constructor name when exists
     */
    this.applyReferencedObject = function(data, name) {
        var reference = referenceContainer.getReference(name || ((data.constructor && data.constructor.name) || ''));
        if (!reference) {
            return;
        }

        if (reference.__validation) {
            Object.keys(reference.__validation).forEach(function (key) {
                data.body[key] = reference.__validation[key];
            });
            return;
        }

        for (var prop in reference) {
            if (reference.hasOwnProperty(prop)) {
                this.applyReferencedField(data, prop, reference[prop]);
            }
        }
    };

    /**
     * @param {ApiRoute} data
     * @param {string} name
     * @param {any} value
     */
    this.applyReferencedField = function(data, name, value) {
        var issetValue = (value !== null && typeof value !== 'undefined');

        data.body[name] = {};
        data.body[name].type = (issetValue && typeof value) || 'string';
        data.body[name].required = issetValue;
    };

}

/**
 * @type {AnnotationTranslator}
 */
module.exports = AnnotationTranslator;
