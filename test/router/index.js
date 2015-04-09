var should = require('should');


var annotationRouter = require('../../index.js');

var path = './mock.js';


describe('get basic routes', function(){

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
        routes.should.not.be.empty;

        var nb = 0;

        for(var i in routes){
            routes[i].should.be.a.route;
            nb++;
        }

        nb.should.be.equal(5);
    });

    it('should get the first route of getAll', checkRoute('GET', '/user', 'getAll', 'getUsers'));

    it('should get the second route of getAll', checkRoute('GET', '/company{companyId}/user', 'getAll', 'getUsers'));

    it('should get the route of getUser', checkRoute('GET', '/user/{id}', 'getUser', 'getUser'));

    it('should get the route of postUser', checkRoute('POST', '/user', 'postUser', 'addUser'));

    it('should get the route of functionToEditTheUser', checkRoute('PUT', '/user/{id}', 'functionToEditTheUser', 'updateUser'));


    function checkRoute(method, url, actionName, functionResult){
        return function(){
            var route = routes[method + '-' + url];

            should.exist(route, 'route wasn\'t found');

            route.should.have.property('url', url);
            route.should.have.property('method', method);

            route.should.have.property('action');
            route.action().should.be.equal(functionResult);

            route.should.have.property('actionName', actionName);

            route.should.have.property('controller');
            route.controller.should.have.property('name', 'mock');
            route.controller.should.have.property('ext', '.js');
            route.controller.should.have.property('base', 'mock.js');
            route.controller.should.have.property('dir').which.containEql('test/router');
            route.controller.should.have.property('full').which.containEql('test/router/mock.js');
        };
    }
});
