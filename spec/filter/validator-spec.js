"use strict";

var Validator = require('../../src/filter/validator.js');
var Constraint = require('../../src/filter/constraint.js');

describe('validator', function () {
    it('should validate equals constraint', testEqualValidation);
    it('should validate regexp constraint', testRegExpValidation);
    it('should validate length constraint', testLengthValidation);
});

function testEqualValidation() {
    var data = [[ 'handshake' ], [ 'invalid']];
    var validator = new Validator();
    var constraint = new Constraint();
    spyOn(constraint, 'getValue').and.returnValue('handshake');
    spyOn(constraint, 'getContent').and.callFake(function () {
        return data.shift();
    });

    expect(validator.equals(constraint)).toBeTruthy();
    expect(validator.equals(constraint)).toBeFalsy();
    expect(constraint.getValue).toHaveBeenCalled();
    expect(constraint.getContent).toHaveBeenCalled();
}

function testRegExpValidation() {
    var data = [[ 'match' ], [ 'fail' ]];
    var validator = new Validator();
    var constraint = new Constraint();
    spyOn(constraint, 'getValue').and.returnValue('^mat.*$');
    spyOn(constraint, 'getContent').and.callFake(function () {
        return data.shift();
    });

    expect(validator.regexp(constraint)).toBeTruthy();
    expect(validator.regexp(constraint)).toBeFalsy();
}

function testLengthValidation() {
    var data = [[ '123' ], [ '12345' ], [ '1234' ], [ '123' ]];
    var validator = new Validator();
    var constraint = new Constraint();
    spyOn(constraint, 'getValue').and.returnValue(4);
    spyOn(constraint, 'getContent').and.callFake(function () {
        return data.shift();
    });

    expect(validator.maxLength(constraint)).toBeTruthy();
    expect(validator.maxLength(constraint)).toBeFalsy();
    expect(validator.minLength(constraint)).toBeTruthy();
    expect(validator.minLength(constraint)).toBeFalsy();
}
