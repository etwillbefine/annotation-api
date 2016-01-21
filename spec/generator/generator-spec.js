"use strict";

var ApiGenerator = require('../../src/generator/generator');

describe('generator', function () {
    it('should use default prefix', testDefaultPrefix);
    it('should resolve routing files to routes', testResolveMethodCall);
});

function testDefaultPrefix() {
    var generator = new ApiGenerator();
    expect(generator.getApiPrefix()).toEqual('/api');

    generator = new ApiGenerator('/prefix');
    expect(generator.getApiPrefix()).toEqual('/prefix');

    generator = new ApiGenerator('/custom');
    expect(generator.getApiPrefix()).toEqual('/custom');
}

function testResolveMethodCall() {
    var routingFiles = [ __dirname + '/../sample/sample.js' ];
    var generator = new ApiGenerator();
    spyOn(generator, 'generateRoutes').and.callThrough();
    spyOn(generator, 'translateFiles');

    generator.generate(routingFiles, function () {});

    expect(generator.translateFiles).toHaveBeenCalled();
    expect(generator.generateRoutes).toHaveBeenCalledWith(0, routingFiles, jasmine.any(Function));
}
