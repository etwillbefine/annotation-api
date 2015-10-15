"use strict";

var exp = require('express');
var app = exp();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = require('http').createServer(app);
server.listen(3400);

// pass null instead of app, if you want to use the built in web server
require('./../index.js')(
    app, [ __dirname + '/sample.js' ],
    function() {
        console.log("API compiled");
    }
);
