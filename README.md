# node-annotation-router [![Build Status](https://travis-ci.org/mastilver/node-annotation-router.svg)](https://travis-ci.org/mastilver/node-annotation-router) [![Coverage Status](https://coveralls.io/repos/mastilver/node-annotation-router/badge.svg)](https://coveralls.io/r/mastilver/node-annotation-router)


> Bring annotations to your favorite routing framework


## Install

`$ npm install --save annotation-router`


## Usage

given this file `controller.js`

```
/*
    @routePrefix('/api')
*/
module.exports = {

    // @httpGet()
    // @route('/collection')
    collection: function(){

    },


    // @route('/collection/{id}')
    getIndex: function(){

    },

    // @route('/collection')
    postItem: function(){

    },
> };
```


You can then simply retrieve each single route by doing so:

```

var annotationRouter = require('annotation-router');

annotationRouter('controller.js', function(err, route){

    console.log(route);
    /*
        {
            url: '/api/collection',
            method: 'GET',
            action: /* the action function */
        },
        ...
    */
}, function(err){
    // all routes have been parsed
});

```


## API

### annotationRouter(paths, eachCallback, finalCallback);

#### paths

*Required*  
Type: `string`, `array`  
> paths of the all the controllers in the solution that will be checked for routing annotations  
> check [globby](https://github.com/sindresorhus/globby) for details


#### eachCallback(err, route)

##### route.url

Type: `string`


##### route.method

Type: `string`  
Possible Values: `GET`, `POST`, `PUT`, `DELETE`, `HEAD`  

##### route.action

Type: `Function`
> The action function associated with the route  

#### finalCallback(err)


## Annotations API

### @routePrefix(url)

> All the functions inside the module will prepend the `prefixUrl` to theirs urls


### @route(url)

> The function following this annotation will be called when someone request the `url`

### @httpGet() and equivalents


> Set the method of the route  
> If none of the available method definition annotation could be found, the route's method will be guessed from the name of the function


## Inspiration

[Vatican](https://github.com/deleteman/vatican) is another library which use annotation to define routes. Although it's a standalone library which means you can't use your favorite routing library.

If you ever work with Microsoft's MVC library, you surely noticed that we are trying to reproduce the same behavior.


## Licence

MIT © Thomas Sileghem
