"use strict";

var AnnotationApi = require('../src/annotation-api');
var SecurityContext = require('../src/security');
var glob = require('glob');
var path = require('path');

describe('annotation module', function () {
    it('should use glob when a string was passed', testGlobUsage);
    it('should use absolute paths and the passed file array', testPathsAndFileArray);
    it('should provide storage change', testStorageChange);
});

function testGlobUsage() {
    var api = new AnnotationApi(null, null, false);
    spyOn(api, 'generateFilePaths').and.callThrough();
    spyOn(api.getGenerator(), 'generateRoutes');
    spyOn(glob, 'sync').and.returnValue([ '/an/absolute/glob/path' ]);

    api.generate('./', function() {});

    var absoluteNormalizedPath = path.normalize(__dirname + '/../src/../../../');

    expect(api.generateFilePaths).toHaveBeenCalledWith('./');
    expect(glob.sync).toHaveBeenCalledWith(absoluteNormalizedPath);
    expect(api.getGenerator().generateRoutes).toHaveBeenCalledWith(
        0, [ '/an/absolute/glob/path' ], jasmine.any(Function)
    );
}

function testPathsAndFileArray() {
    var api = new AnnotationApi(null, null, false);
    spyOn(api, 'generateFilePaths');
    spyOn(api.getGenerator(), 'generate').and.callThrough();

    api.generate([ 'file' ], function() {});

    expect(api.generateFilePaths).not.toHaveBeenCalled();
    expect(api.getGenerator().generate).toHaveBeenCalledWith([ 'file' ], jasmine.any(Function));
}

function testStorageChange() {
    var api = new AnnotationApi(null, null, false);

    expect(api.getGenerator()).toBeDefined();
    expect(api.getSecurityContext()).toBeDefined();
    expect(api.getSecurityContext().getSessionStorage().hasStorage()).toBeFalsy();

    api.setSessionStorage({ get: function() {} });

    expect(api.getSecurityContext().getSessionStorage().hasStorage()).toBeTruthy();

    api.setApiPrefix('/my-prefix');

    expect(api.getGenerator().getApiPrefix()).toEqual('/my-prefix');
}
