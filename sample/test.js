"use strict";

var exp = require('express');
var app = exp();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = require('http').createServer(app);
server.listen(3400);

// pass null instead of app, if you want to use the built in web server
var generator = require('./../index.js')(
    app, [ __dirname + '/sample.js' ],
    function(c) {
        console.log("Test-API compiled "  + c + " routes available.");
    }
);

generator.addSecurityMethod('is_authenticated', function (req, callback) {
    callback(null, { name: 'session owner' });
});

generator.addSecurityMethod('is_fully_authenticated', function (req, callback) {
    callback({ message: 'is not fully authenticated', code: 405 }, null);
});
