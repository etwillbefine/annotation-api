"use strict";

var HttpResponse = require('../../src/http/response');
var responseMock = { setHeader: function() {}, end: function() {} };

describe('response', function() {
    it('should set the correct content type', testContentType);
});

function testContentType() {
    var res = new HttpResponse(responseMock);
    spyOn(responseMock, 'setHeader');
    spyOn(responseMock, 'end');
    spyOn(JSON, 'stringify').and.returnValue('stringified json');

    res.json({ my: 'response' });
    res.send('plain response');

    expect(JSON.stringify).toHaveBeenCalledWith({ my: 'response' });
    expect(responseMock.end).toHaveBeenCalledTimes(2);
    expect(responseMock.end).toHaveBeenCalledWith('stringified json');
    expect(responseMock.end).toHaveBeenCalledWith('plain response');
    expect(responseMock.setHeader).toHaveBeenCalledTimes(2);
    expect(responseMock.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(responseMock.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
}
