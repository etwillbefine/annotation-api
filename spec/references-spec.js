"use strict";

var ReferenceContainer = require('../src/references');

describe('reference container', function() {
    it('should return the reference', testContainer);
});

function testContainer() {
    var container = new ReferenceContainer();
    container.addReference({ my: 'object' }, 'a name');

    expect(container.getReference('a name')).toEqual({ my: 'object' });
}
