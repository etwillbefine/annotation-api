"use strict";

var Validator = require('../../src/filter/validator.js');
var Constraint = require('../../src/filter/constraint.js');
var getFilter = require('../../src/filter/index.js')();

describe('validator', function () {
    it('should validate equals constraint', testEqualValidation);
    it('should validate regexp constraint', testRegExpValidation);
    it('should validate length constraint', testLengthValidation);
    it('should map the validation method to constraint', testConstraintsValidate);
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

function testConstraintsValidate() {
    var data = [[ 'abc' ], [ 'fail' ]];
    /** @type {Constraint} */
    var equalsFilter = getFilter('equals');

    expect(equalsFilter).toEqual(jasmine.any(Constraint));
    expect(equalsFilter.validate).toEqual(jasmine.any(Function));

    spyOn(equalsFilter, 'getValue').and.returnValue('abc');
    spyOn(equalsFilter, 'getContent').and.callFake(function () {
        return data.shift();
    });

    expect(equalsFilter.validate(equalsFilter)).toBeTruthy();
    expect(equalsFilter.validate(equalsFilter)).toBeFalsy();
}
