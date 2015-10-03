"use strict";

var exp = require('express');
var app = exp();

var server = require('http').createServer(app);
server.listen(3400);

require('./../index.js')(
    app, [ __dirname + '/sample.js' ],
    function() {
        console.log("API compiled");
    }
);
