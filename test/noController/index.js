var should = require('should');


var annotationRouter = require('../../index.js');

var path = 'test/noController/doNotExist.js';


describe('when there is no controller that match the pattern', function(){

    var routes = {};
    var err;

    before(function(done){
        annotationRouter(path, function(e, route){

            if(e) err = e;

            routes[route.method + '-' + route.url] = route;

        }, done);
    });

    it('should have gone well', function(){
        should.ifError(err);
    });

    it('should have no route', function(){
        routes.should.be.empty;
    });
});
