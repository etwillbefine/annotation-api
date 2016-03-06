"use strict";

var AnnotationApi = require('../../src/annotation-api');
var DocBuilder = require('./builder');
var DocGenerator = require('./generator');
var DocSummary = require('./summary');
var fs = require('fs');
var path = require('path');
var targetPath = __dirname + '/doc';
var summary = null;
var routes = 0;
var generated = 0;

/**
 * @param {Array<string>} args
 */
module.exports = function(args) {
    targetPath = args.shift();
    if (targetPath.charAt(targetPath.length-1) === '/') {
        targetPath = targetPath.slice(0, targetPath.length-1);
    }
    var existsTarget = fs.existsSync(targetPath);
    if (!targetPath || (existsTarget && !fs.lstatSync(targetPath).isDirectory())) {
        throw 'Please specify a valid target path (directory).\n' + getUsage();
    }
    if (!existsTarget) {
        fs.mkdirSync(targetPath);
    }
    if (!fs.existsSync(targetPath + '/routes')) {
        fs.mkdirSync(targetPath + '/routes');
    }
    if (!args.length) {
        throw 'Please specify a path where we can search for annotations.\n'+ getUsage();
    }

    summary = new DocSummary(targetPath);
    var api = new AnnotationApi(null, null, false);
    var builder = new DocBuilder();
    var generator = new DocGenerator(targetPath, routeDocGenerated);

    for (var a = 0; a < args.length; a++) {
        var paths = api.generateFilePaths(args[a]);
        if (!paths.length) {
            console.error('No files found in ' + args[a] + '.');
            continue;
        }

        for (var p = 0; p < paths.length; p++) {
            if (!paths[p]) {
                continue;
            }

            builder.build(paths[p], function (apiRoutes) {
                routes += apiRoutes.length;
                generator.append(apiRoutes);
            });
        }
    }
};

function routeDocGenerated(data) {
    generated++;
    console.log(generated + '. documentation generated (' + data.route.route + ')');

    var urlParts = data.route.route.replace('/', '').split('/');
    summary.add(urlParts.shift(), data);

    if (routes === generated) {
        summary.createSummary(routes);
    }
}

function getUsage() {
    return 'node cli doc-builder <target-path> <actions-path> [<another-one>] [...]';
}
