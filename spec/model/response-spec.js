"use strict";

var Response = require('../../src/model/response');

describe('response model', function () {
    it('should map json to the model and return result', testResponseMapping);
});

function testResponseMapping() {
    var res = new Response();
    var json = {
        redirect: '/somewhere',
        json: {},
        invalid: 'field'
    };

    expect(res.map(json)).toEqual(res);
    expect(res.status).toEqual(200);
    expect(res.redirect).toEqual(json.redirect);
    expect(res.json).toEqual(json.json);
    expect(res.invalid).toBeUndefined();
}
