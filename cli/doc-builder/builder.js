"use strict";

var fs = require('fs');
var annotation = require('annotation');
var AnnotationTranslator = require('../../src/generator/translator');

function DocBuilder() {

    var translator = new AnnotationTranslator({
        mapFields: function(obj) { return obj; }
    });

    this.build = function(filePath, callback) {
        if (!fs.lstatSync(filePath).isFile()) {
            callback([]);
            return;
        }

        annotation(filePath, function (reader) {
            var comments = reader.comments.methods;
            var apiRoutes = [];

            Object.keys(comments).forEach(function (action) {
                apiRoutes.push(translator.translate(comments[action], true));
            });

            callback(apiRoutes);
        });
    };

}

/**
 * @type {DocBuilder}
 */
module.exports = DocBuilder;
