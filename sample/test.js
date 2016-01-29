'use strict';

var exp = require('express');
var app = exp();
var bodyParser = require('body-parser');
var samples = [ __dirname + '/sample.js' ];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = require('http').createServer(app);
server.listen(3400);

// pass null instead of app, if you want to use the built in web server
/** @type {AnnotationApi} */
var api = require('./../index.js')(app);
api.addReference({ prop: 0 }, 'TestDTO');

api.addSecurityMethod('is_authenticated', function (req, callback) {
    callback(null, { name: 'session owner' });
});

api.addSecurityMethod('is_fully_authenticated', function (req, callback) {
    callback({ message: 'is not fully authenticated', code: 405 }, null, '/optional/error/redirect');
});

api.generate(samples, function(c) {
    console.log('Test-API compiled '  + c + ' routes available.');
});
