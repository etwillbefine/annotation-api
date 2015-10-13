"use strict";

var exp = require('express');
var app = exp();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = require('http').createServer(app);
server.listen(3400);

require('./../index.js')(
    null, [ __dirname + '/sample.js' ],
    function() {
        console.log("API compiled");
    }
);
