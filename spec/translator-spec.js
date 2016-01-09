"use strict";

var AnnotationTranslator = require('../src/translator');
var ApiRoute = require('../src/route');

describe('annotation translator', function () {
    it('should map the annotation block to an ApiRoute', testApiRouteMapping);
});

function testApiRouteMapping() {
    var translator = new AnnotationTranslator();
    var route = translator.translate([
        { key: 'Route', value: '/somewhere' },
        { key: 'Method', value: 'GET' },
        { key: 'Query', value: {} },
        { key: 'Body', value: { field: 'value' } },
        { key: 'CustomErrorHandler' }
    ]);

    expect(route).toEqual(jasmine.any(ApiRoute));
    expect(route.route).toEqual('/somewhere');
    expect(route.method).toEqual('get');
    expect(route.query).toEqual({});
    expect(route.body).toEqual({ field: 'value' });
    expect(route.useCustomErrorHandler).toBeTruthy();
}
