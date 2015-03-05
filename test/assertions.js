var should = require('should');


should.Assertion.add('route', function(){

    this.param = {
        operator: 'to be a route',
    };

    this.obj.should.have.property('url');
    this.obj.should.have.property('method');

}, true);
