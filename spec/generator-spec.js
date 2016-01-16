"use strict";

var ApiGenerator = require('../src/generator');

describe('generator', function () {
    it('should use default prefix', testDefaultPrefix);
    it('should resolve routing files to routes', testResolveMethodCall);
});

function testDefaultPrefix() {
    var generator = new ApiGenerator();
    expect(generator.getApiPrefix()).toEqual('/api');

    generator = new ApiGenerator(null, '/custom', false);
    expect(generator.getApiPrefix()).toEqual('/custom');
}

function testResolveMethodCall() {
    var routingFiles = [ __dirname + '/../sample/sample.js' ];
    var generator = new ApiGenerator({}, null, false);
    spyOn(generator, 'resolveAPIFile');

    generator.generate(routingFiles, function() {});

    expect(generator.resolveAPIFile).toHaveBeenCalledWith(0, routingFiles, jasmine.any(Function));
}
