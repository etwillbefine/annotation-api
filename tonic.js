"use strict";

var express = require('express');
var app = express();
var files = [ __dirname + '/sample/sample.js' ];
var start = new Date().getTime();
var called = 0;

var generator = require('./index.js')(app, files, finished);
generator.setApiPrefix('/other-api');
generator.generate(files, finished);

function finished(count) {
    console.log(count + ' routes available.');
    called++;

    if (called == 2) {
        console.log('toni example ends after ' + (new Date().getTime() - start) + 'ms');
    }
}
