"use strict";

var Parser = require('../../src/filter/parser');

describe('request parser', function () {
    it('should parse the request payload', testPayloadParser);
    it('should validate the type', testTypeValidation);
    it('should parse the properties', testPropertyParser);
    it('should check the validation rules', testRuleValidation);
});

function testPayloadParser() {
    var parser = new Parser();

    spyOn(parser, 'parseProperty');
    var result = parser.parsePayload({ required: true });

    expect(result.success).toBeFalsy();
    expect(result.errors.length).toEqual(1);
    expect(parser.parseProperty).not.toHaveBeenCalled();

    parser.parsePayload({ required: true }, 'given');

    expect(parser.parseProperty).toHaveBeenCalledTimes(1);
}

function testTypeValidation() {
    var parser = new Parser();

    expect(parser.validateType('array', [])).toBeTruthy();
    expect(parser.validateType('object', {})).toBeTruthy();
    expect(parser.validateType('number', 1)).toBeTruthy();
    expect(parser.validateType('string', 'abc')).toBeTruthy();

    expect(parser.validateType('object', [])).toBeFalsy();
    expect(parser.validateType('array', {})).toBeFalsy();
    expect(parser.validateType('string', [])).toBeFalsy();
    expect(parser.validateType('number', 'a1')).toBeFalsy();
}

function testRuleValidation() {
    var parser = new Parser();
    spyOn(parser, 'validateRule').and.callThrough();

    expect(parser.validateRules({ equals: 100 }, 100)).toBeTruthy();
    expect(parser.validateRules({ equals: 100 }, 80)).toBeFalsy();
    expect(parser.validateRule).toHaveBeenCalledTimes(2);
}

function testPropertyParser() {
    var parser = new Parser();
    spyOn(parser, 'validateType').and.callThrough();
    spyOn(parser, 'validateRules').and.callThrough();
    parser.getResponse().errors.push = jasmine.createSpy('push');

    parser.parseProperty('prop', { required: true }, '', 'get');
    parser.parseProperty('prop', { required: false }, '', 'get');
    parser.parseProperty('prop', { type: 'number', required: true }, 'invalid type', 'get');
    parser.parseProperty('prop', { type: 'number', required: true }, 80, 'get');
    parser.parseProperty('prop', { type: 'number', required: true }, 100, 'get');

    expect(parser.getResponse().errors.push.calls.count()).toEqual(2);
    expect(parser.validateType).toHaveBeenCalledTimes(3);
    expect(parser.validateRules).toHaveBeenCalledTimes(2);
}
