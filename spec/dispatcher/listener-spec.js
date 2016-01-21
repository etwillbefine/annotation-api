"use strict";

var RequestListener = require('../../src/dispatcher/listener');

describe('request listener', function() {
    it('should listen for http requests', testListener);
});

function testListener() {
    var app = { get: function() {}, post: function() {} };
    var getListener = new RequestListener(app, { route: '/somewhere', method: 'get' });
    var postListener = new RequestListener(app, { route: '/post', method: 'post' });
    spyOn(app, 'get');
    spyOn(app, 'post');

    getListener.bind();
    postListener.bind();

    expect(app.get).toHaveBeenCalledWith('/somewhere', jasmine.any(Function));
    expect(app.post).toHaveBeenCalledWith('/post', jasmine.any(Function));
}
