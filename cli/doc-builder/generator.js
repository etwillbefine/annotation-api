
var fs = require('fs');
const Templates = {
    md: fs.readFileSync(__dirname + '/templates/md/request.md')
};

/**
 * @param {string} targetPath
 * @constructor
 */
function DocGenerator(targetPath) {
    "use strict";

    /**
     * @param {Array<ApiRoute>} apiRoutes
     */
    this.append = function(apiRoutes) {
        for (var r = 0; r < apiRoutes.length; r++) {
            this.generateRouteDoc(apiRoutes[r]);
        }
    };

    /**
     * @param {ApiRoute} route
     */
    this.generateRouteDoc = function(route) {
        var doc = Templates.md.toString() + '';
        doc = this.parseTemplate(doc, route);
        doc = this.parsePayload(doc, route);
        doc = this.parseResponse(doc, route);
        doc = this.parseSecurity(doc, route);

        while (doc.indexOf('%route%') != -1 && doc.indexOf('%method%') != -1 && doc.indexOf('\n\n') != -1) {
            doc = doc.replace('%route%', route.route);
            doc = doc.replace('%method%', route.method.toUpperCase());
            doc = doc.replace('\n\n', '\n');
        }

        var path = targetPath + '/routes/' + route.route.replace(/\//g, '-').slice(1) + '___' + route.method + '.md';

        fs.writeFile(path, doc);
        this.emit('generated', { route: route, path: path, content: doc });
    };

    /**
     * @param {string} doc
     * @param {ApiRoute} route
     * @returns {string}
     */
    this.parseTemplate = function(doc, route) {
        var hasQuery = Object.keys(route.query).length > 0;
        var hasBody = Object.keys(route.body).length > 0;

        if (!hasQuery) {
            doc = doc.replace(/^(\/\/block_get)[\s\S]*(\/\/endblock_get)$/igm, '');
        }
        else {
            doc = doc.replace('//block_get', '');
            doc = doc.replace('//endblock_get', '');
        }

        if (!hasBody || route.method === 'get') {
            doc = doc.replace(/^(\/\/block_post)[\s\S]*(\/\/endblock_post)$/igm, '');
        }
        else {
            doc = doc.replace('//block_post', '');
            doc = doc.replace('//endblock_post', '');
        }

        if (!route.possibleResponses.length && !route.redirectErrorHandler) {
            doc = doc.replace(/^(\/\/block_response)[\s\S]*(\/\/endblock_response)$/igm, '');
        }
        else {
            doc = doc.replace('//block_response', '');
            doc = doc.replace('//endblock_response', '');
        }

        return doc
    };

    /**
     * @param {string} doc
     * @param {ApiRoute} route
     * @returns {string}
     */
    this.parsePayload = function(doc, route) {
        doc = doc.replace('%query%', JSON.stringify(route.query, null, 4));
        doc = doc.replace('%body%', JSON.stringify(route.body, null, 4));

        return doc;
    };

    /**
     * @param {string} doc
     * @param {ApiRoute} route
     * @returns {string}
     */
    this.parseResponse = function(doc, route) {
        var response = '';
        for (var r = 0; r < route.possibleResponses.length; r++) {
            var res = route.possibleResponses[r];

            if (res.status != null) {
                response += 'Status: ' + res.status + '\n';
            }
            if (res.redirect != null) {
                response += 'Redirect: ' + res.redirect + '\n';
            }
            if (res.contentType != null) {
                response += 'Content-Type: ' + res.contentType + '\n';
            }
            if (res.json != null) {
                response += JSON.stringify(res.json, null, 4) + '\n';
            }
            if (res.xml != null) {
                response += JSON.stringify(res.xml, null, 4) + '\n';
            }
            if (res.plain != null) {
                response += res.plain + '\n';
            }
        }

        if (route.redirectErrorHandler) {
            response += 'Error-Redirect: ' + route.redirectErrorHandler + '\n';
        }

        return doc.replace('%response%', response.slice(0, response.length-1));
    };

    /**
     * @param {string} doc
     * @param {ApiRoute} route
     * @returns {string}
     */
    this.parseSecurity = function(doc, route) {
        var security = '';
        if (route.security) {
            security += '```\n';
            if (typeof route.security === 'string') {
                security += 'Authenticator: ' + route.security;
            }
            else if (route.security.method) {
                security += 'Method: ' + route.security.method + '\n';
                security += 'Session: ' + route.security.session + '\n';
                security += 'Authenticator: ' + (route.security.authenticator || 'Storage/Express') + '\n';
            }
            security += '\n```\n';
        }

        return doc.replace('%security%', security);
    };

}

var EventEmitter = require('events').EventEmitter;
DocGenerator.prototype = new EventEmitter();

/**
 * @type {DocGenerator}
 */
module.exports = DocGenerator;
