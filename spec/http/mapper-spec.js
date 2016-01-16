"use strict";

var EventEmitter = require('events').EventEmitter;
var RequestMapper = require('../../src/http/mapper');

describe('request mapper', function () {
    it('should map the query params correctly', testQueryParamsMapper);
    it('should map the body params correctly', testBodyParamsMapper);
    it('should covert the string body to json object', testBodyJSONConversion);
    it('should covert the string body to object', testBodyUrlEncodeConversion);
    it('should reject the request if the payload is greater than 2.5mb', testRequestRejection);
    it('should decode the payload params', testParamsDecode);
    it('should call the onFinished callback when finished', testCallbackWhenFinished);
});

function testQueryParamsMapper() {
    var request = Object.create(Request);
    var mapper = new RequestMapper(request, 'get');
    spyOn(mapper, 'mapped');

    mapper.map();

    expect(mapper.getQuery()).toEqual({ query: 'param', mapper: 'test' });
    expect(mapper.mapped).toHaveBeenCalled();
}

function testBodyParamsMapper() {
    var request = Object.create(Request);
    var mapper = new RequestMapper(request, 'post');

    spyOn(mapper, 'mapped');
    spyOn(mapper, 'mapBody');
    expect(mapper.getBody()).toEqual({});

    mapper.map();

    request.emit('data', 'body=param;mapper=test');
    request.emit('end');

    expect(mapper.mapBody).toHaveBeenCalled();
    expect(mapper.mapped).toHaveBeenCalled();
    expect(mapper.getPlainBody()).toEqual('body=param;mapper=test');
}

function testBodyJSONConversion() {
    var request = Object.create(Request);
    var mapper = new RequestMapper(request, 'post');
    spyOn(mapper, 'mapped');

    mapper.map();
    request.emit('data', '{"body":"param",');
    request.emit('end', '"mapper":"test"}');

    expect(mapper.mapped).toHaveBeenCalled();
    expect(mapper.getBody()).toEqual({
        body: 'param',
        mapper: 'test'
    });
}

function testBodyUrlEncodeConversion() {
    var request = Object.create(Request);
    var mapper = new RequestMapper(request, 'post');

    mapper.map();
    request.emit('end', 'body=param&mapper=test');

    expect(mapper.getBody()).toEqual({
        body: 'param',
        mapper: 'test'
    });
}

function testRequestRejection() {
    var request = Object.create(Request);
    var mapper = new RequestMapper(request, 'post');
    spyOn(request.connection, 'destroy');

    var str = 'abcdefghijklmopqrstuvwxyz0123456789';
    while(str.length < 5140) {
        str += str;
    }

    mapper.map();
    request.emit('data', str);

    expect(request.connection.destroy).toHaveBeenCalled();
}

function testParamsDecode() {
    var request = Object.create(Request);
    var mapper = new RequestMapper(request, 'get');
    request.url = 'http://my-domain.de?query=%3F';

    mapper.map();

    expect(Object.keys(mapper.getQuery()).length).toEqual(1);
    expect(mapper.getQuery().query).toEqual('?');
}

function testCallbackWhenFinished(done) {
    var request = Object.create(Request);
    var mapper = new RequestMapper(request, 'get');
    spyOn(mapper, 'mapped').and.callThrough();

    mapper.setOnFinished(function () {
        expect(mapper.mapped).toHaveBeenCalled();

        done();
    });

    mapper.map();
}

var emitter = new EventEmitter();
var Request = {
    on: emitter.on,
    emit: emitter.emit,
    url: 'http://my-domain.de?query=param&mapper=test',
    connection: { destroy: function () {} }
};
