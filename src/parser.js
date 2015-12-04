const STRING_TYPE = 'string';
const NUMBER_TYPE = 'number';
const OBJECT_TYPE = 'object';
const ARRAY_TYPE = 'array';

var getFilter = require('./filter')();

function APIPayloadParser() {
    "use strict";

    var response = new ParserResponse();

    /**
     * @param {Object} expected
     * @param {Object} given
     * @param {string} method
     * @return {ParserResponse}
     */
    this.parsePayload = function(expected, given, method) {
        if (typeof given == 'undefined' && Object.keys(expected).length > 0) {
            response.success = false;
            response.errors.push({
                error: 'no_payload_provided',
                request: 'rejected',
                method: method
            });

            return response;
        }

        for(var prop in expected) {
            if (expected.hasOwnProperty(prop)) {
                parseProperty(prop, expected[prop], given[prop], method);
            }
        }

        response.success = response.errors.length == 0;
        return response;
    };

    /**
     * @param {string} prop
     * @param {Object} expected
     * @param {string} method
     * @param {*} given
     */
    var parseProperty = function(prop, expected, given, method) {
        var isParameterEmpty = typeof given == 'undefined' || given === '';

        if (isParameterEmpty && expected.required === false) {
            given = expected.default;
            return;
        }

        if (isParameterEmpty) {
            response.errors.push({
                error: 'missing_property',
                key: prop,
                method: method
            });
            return;
        }

        var abort = validateType(expected.type, given);
        if (abort === false) {
            response.errors.push({
                error: 'invalid_type',
                key: prop,
                method: method
            });
            return;
        }

        abort = validateRules(expected.rules, given);
        if (abort === false) {
            response.errors.push({
                error: 'invalid_content',
                key: prop,
                method: method
            });
        }
    };

    /**
     * @param {string} expected
     * @param {*} given
     * @return {Boolean}
     */
    var validateType = function(expected, given) {
        switch (expected) {
            case STRING_TYPE:
                return typeof given == 'string';
            case NUMBER_TYPE:
                return !isNaN(parseFloat(given)) && isFinite(given);
            case OBJECT_TYPE:
                return Object.prototype.toString.call(given) === '[object Array]';
            case ARRAY_TYPE:
                return typeof given == 'object';
            default:
                return true;
        }
    };

    /**
     * @param {Array} rules
     * @param {*} given
     * @return {Boolean}
     */
    var validateRules = function(rules, given) {
        if (!rules) {
            return true;
        }

        for(var r in rules) {
            if (!rules.hasOwnProperty(r)) continue;
            var result = validateRule(r, rules[r], given);

            if (result == false) {
                return false;
            }
        }

        return true;
    };

    /**
     * @param {string} ruleName
     * @param {string|number} expected
     * @param {*} given
     * @return {boolean}
     */
    var validateRule = function(ruleName, expected, given) {
        /** @type {Constraint} **/
        var constraint = getFilter(ruleName);
        constraint.addContent(expected);
        constraint.setValue(given);

        return constraint.validate(constraint);
    };

    /**
     * @return {ParserResponse}
     */
    this.getResponse = function() {
        return response;
    };

}

/**
 * @constructor
 */
function ParserResponse() {
    "use strict";

    this.success = false;
    this.errors = [];

    this.getErrors = function() {
        return this.errors;
    };

    this.isSuccess = function() {
        return this.success;
    };
}

/**
 * @type {APIPayloadParser}
 */
module.exports = APIPayloadParser;
