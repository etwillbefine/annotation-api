"use strict";

var express = require('express');
var app = express();
var files = [ __dirname + '/sample/sample.js' ];
var start = new Date().getTime();
var called = 0;

/** @type {APIGenerator} */
var generator = require('./index.js')(app);

// add a custom is_authenticated method, otherwise you can add a storage interface
generator.addSecurityMethod('is_authenticated', function (request, callback) {
    callback(null, { name: 'session owner' });
});

generator.setApiPrefix('/other-api');
generator.generate(files, finished);
generator.setApiPrefix('/another/one');
generator.generate(files, finished);

function finished(count) {
    console.log(count + ' routes available.');
    called++;

    if (called == 2) {
        console.log('toni example ends after ' + (new Date().getTime() - start) + 'ms');
    }
}
