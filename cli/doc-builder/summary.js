"use strict";

var fs = require('fs');

/**
 * @param {string} targetPath
 * @constructor
 */
function DocSummary(targetPath) {

    var summary = {};

    /**
     * @param {number} routeCount
     */
    this.createSummary = function(routeCount) {
        var summaryFile = '# API Documentation\n';

        Object.keys(summary).forEach(function (baseurl) {
            var singleFile = '';
            for (var r = 0; r < summary[baseurl].length; r++) {
                singleFile += summary[baseurl][r].content;
                fs.unlink(summary[baseurl][r].path);
            }

            // replace request method to combine them in a single file
            var newPath = summary[baseurl][0].path.replace(/___(get|post|put|delete|head)/ig, '');
            summaryFile += '- [/' + baseurl + '](routes/' + baseurl + '.md)\n';
            fs.writeFile(newPath, singleFile);
        });

        summaryFile += '\n' + routeCount + ' route definitions available.  \n';
        summaryFile += '*Documentation generated with [`annotation-api`](https://www.npmjs.com/package/annotation-api).*';
        fs.writeFile(targetPath + '/overview.md', summaryFile);
    };

    /**
     * @param baseUrl
     * @param data
     */
    this.add = function(baseUrl, data) {
        if (!summary[baseUrl]) {
            summary[baseUrl] = [ data ];
            return;
        }

        summary[baseUrl].push(data);
    };

}

/**
 * @type {DocSummary}
 */
module.exports = DocSummary;
