var should = require('should');


var annotationRouter = require('../../index.js');

var path = './doNotExist.js';


describe('when there is no controller that match the pattern', function(){

    describe('asynchronous', function(){

        var routes = {};
        var err;

        before(function(done){
            annotationRouter(path, function(e, route){

                if(e) return err = e;

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



    describe('synchronous', function(){

        var routes = {};
        var err;

        before(function(){

            try {
                annotationRouter.sync(path).map(function(route){
                    routes[route.method + '-' + route.url] = route;
                });
            } catch (e) {
                err = e;
            }
        });

        it('should have gone well', function(){
            should.ifError(err);
        });

        it('should have no route', function(){
            routes.should.be.empty;
        });
    });
});
