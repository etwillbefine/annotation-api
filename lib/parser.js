const STRING_TYPE = 'string';
const NUMBER_TYPE = 'number';
const OBJECT_TYPE = 'object';
const ARRAY_TYPE = 'array';

const MIN_LENGTH = 'minLength';
const MAX_LENGTH = 'maxLength';

function APIPayloadParser() {
    "use strict";

    var response = new ParserResponse();

    /**
     * @param {Object} expected
     * @param {Object} given
     * @param {string} method
     * @return {ParserResponse}
     */
    this.parseRequest = function(expected, given, method) {
        if (typeof given == 'undefined') {
            response.success = false;
            response.errors.push({
                error: 'no_payload_provided',
                request: 'rejected',
                method: method
            });

            return response;
        }

        for(var prop in expected) {
            if (!expected.hasOwnProperty(prop)) {
                continue;
            }

            parseProperty(prop, expected[prop], given[prop], method);
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

        abort = validateRules(expected.type, expected.rules, given);
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
        }

        return false;
    };

    /**
     * @param {string} type
     * @param {Array} rules
     * @param {*} given
     * @return {Boolean}
     */
    var validateRules = function(type, rules, given) {
        if (!rules) {
            return true;
        }

        for(var r in rules) {
            var result = validateRule(type, r, rules[r], given);

            if (result == false) {
                return false;
            }
        }

        return true;
    };

    /**
     * @param {string} type
     * @param {string} ruleName
     * @param {string|number} ruleValue
     * @param {*} given
     * @return {boolean}
     */
    var validateRule = function(type, ruleName, ruleValue, given) {
        switch (ruleName) {
            case MIN_LENGTH:
                if (type == STRING_TYPE || type == ARRAY_TYPE) {
                    return given.length >= ruleValue;
                }
                break;
            case MAX_LENGTH:
                if (type == STRING_TYPE || type == ARRAY_TYPE) {
                    return given.length <= ruleValue;
                }
                break;
        }

        return true;
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
    this.success = false;
    this.errors = [];
}

/**
 * @type {APIPayloadParser}
 */
module.exports = APIPayloadParser;
