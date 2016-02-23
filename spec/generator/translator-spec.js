"use strict";

var AnnotationTranslator = require('../../src/generator/translator');
var ReferenceContainer = require('../../src/references');
var ApiRoute = require('../../src/model/route');

describe('annotation translator', function () {
    it('should map the annotation block to an ApiRoute', testApiRouteMapping);
    it('should map properties from referenced object to body', testObjectMapping);
});

function testApiRouteMapping() {
    var translator = new AnnotationTranslator();
    var route = translator.translate([
        { key: 'Route', value: '/somewhere' },
        { key: 'Method', value: 'GET' },
        { key: 'Query', value: {} },
        { key: 'Body', value: { field: 'value' } },
        { key: 'CustomErrorHandler' },
        { key: 'RedirectErrorHandler', value: '/error' },
        { key: 'Security', value: 'security_method' }
    ]);

    expect(route).toEqual(jasmine.any(ApiRoute));
    expect(route.route).toEqual('/somewhere');
    expect(route.method).toEqual('get');
    expect(route.query).toEqual({});
    expect(route.body).toEqual({ field: 'value' });
    expect(route.security).toEqual('security_method');
    expect(route.redirectErrorHandler).toEqual('/error');
    expect(route.useCustomErrorHandler).toBeTruthy();
}

function testObjectMapping() {
    var container = new ReferenceContainer();
    container.addReference(new myclass(), 'my_class');
    container.addReference(new myclass_with_validator(), 'ns.validator');

    var translator = new AnnotationTranslator(container);
    spyOn(container, 'mapFields').and.callThrough();
    spyOn(container, 'mapUnspecifiedField').and.callThrough();

    var route = translator.translate([
        { key: 'Body', value: { body_prop: { type: 'number' }}},
        { key: 'Append', value: 'my_class.class' },
        { key: 'Append', value: 'ns.validator.class' }
    ]);

    expect(container.mapFields).toHaveBeenCalledTimes(2);
    expect(container.mapUnspecifiedField).toHaveBeenCalledTimes(3);
    expect(route.body).toEqual({
        body_prop: { type: 'number' },
        another_prop: { type: 'number', required: true },
        my_prop: { type: 'string', required: true },
        not_required: { type: 'string', required: false },
        my_key: { type: 'number', required: true, rules: { rule: 'expected' }}
    });
    expect(function() {
        translator.translate([ { key: 'Append', value: 'invalid' }]);
    }).toThrow();
}

function myclass() {
    this.another_prop = 0;
    this.my_prop = 'default';
    this.not_required = null;
}

function myclass_with_validator() {
    this.__validation = {
        my_key: { type: 'number', required: true, rules: { rule: 'expected' }}
    };
}
