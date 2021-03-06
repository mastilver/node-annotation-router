var should = require('should');


var annotationRouter = require('../../index.js');

var path = './*Ctrl.js';


describe('when there is several controllers that match the pattern', function(){

    describe('asynchronous', function(){

        var routes = {};
        var err;

        before(function(done){
            annotationRouter(path, function(e, route){

                if(e) return err = e;

                routes[route.actionName] = route;

            }, done);
        });

        it('should have gone well', function(){
            should.ifError(err);
        });

        it('should have the route from the first controller', function(){
            routes.should.have.property('fromFirstController');
        })

        it('should have the route from the second controller', function(){
            routes.should.have.property('fromSecondController');
        })
    });



    describe('synchronous', function(){

        var routes = {};
        var err;

        before(function(){

            try {
                annotationRouter.sync(path).map(function(route){
                    routes[route.actionName] = route;
                });
            } catch (e) {
                err = e;
            }
        });

        it('should have gone well', function(){
            should.ifError(err);
        });

        it('should have the route from the first controller', function(){
            routes.should.have.property('fromFirstController');
        })

        it('should have the route from the second controller', function(){
            routes.should.have.property('fromSecondController');
        })
    });
});
