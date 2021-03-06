var path = require('path');

var globby = require('globby');
var caller = require('caller');

var annotationParser = require('annotation-parser');

module.exports = function(pattern, eachCallback, finalizeCallback){

    pattern = path.resolve(path.dirname(caller()), pattern);

    globby(pattern, function(err, files){

        var fileCompleted = 0;

        // loop through the files
        for(var i = 0, len = files.length; i < len; i++){

            (function(fileIndex){
                annotationParser(files[fileIndex], function(err, annotations){

                    var routes = extractRoutes(annotations);

                    var controller = pathParse(files[fileIndex]);
                    controller.annotations = extractControllerAnnotations(annotations.module.annotations);
                    controller.rawAnnotations = extractControllerAnnotations(annotations.module.rawAnnotations);


                    setControllerOnRoutes(controller, routes);

                    for(var i = 0, len = routes.length; i < len; i++){
                        eachCallback(null, routes[i]);
                    }

                    if(++fileCompleted === files.length){
                        finalizeCallback(null);
                    }
                });
            })(i);
        }

        if(files.length === 0){
            finalizeCallback(null);
        }
    });
};

module.exports.sync =  function(pattern){

    pattern = path.resolve(path.dirname(caller()), pattern);

    var files = globby.sync(pattern);

    var routes = [];

    for(var i = 0, len = files.length; i < len; i++){

        var annotations = annotationParser.sync(files[i]);


        var fileRoutes = extractRoutes(annotations);

        var controller = pathParse(files[i]);
        controller.annotations = extractControllerAnnotations(annotations.module.annotations);
        controller.rawAnnotations = extractControllerAnnotations(annotations.module.rawAnnotations);
        

        setControllerOnRoutes(controller, fileRoutes);

        routes = routes.concat(fileRoutes);
    }

    return routes;
};


function extractRoutes(annotations){

    var routes = [];

    // loop through the functions
    for(var functionName in annotations.functions){

        var urls = getUrls(annotations.module.annotations, annotations.functions[functionName].annotations);
        if(urls.length === 0){
            continue;
        }

        var method = getMethod(annotations.functions[functionName].annotations, functionName);


        var actionAnnotations = extractActionAnnotations(annotations.functions[functionName].annotations);
        var actionRawAnnotations = extractActionAnnotations(annotations.functions[functionName].rawAnnotations);

        // loop through the urls (one function can have multiple route)
        for(var i in urls){
            routes.push({
                url: urls[i],
                method: method,
                action: annotations.functions[functionName].ref,
                actionName: functionName,
                annotations: actionAnnotations,
                rawAnnotations: actionRawAnnotations,
            });
        }
    }

    return routes;
}

function setControllerOnRoutes(controller, routes){

    for(var i = 0, len = routes.length; i < len; i++){
        routes[i].controller = controller;
    }

    return routes;
}

function getMethod(functionAnnotations, functionName){

    // search for httpGet/Post/... annotations
    for(var annotationName in functionAnnotations){
        if(annotationName.indexOf('http') === 0){
            var method = annotationName.slice(4);

            if(method.toLowerCase() in methodEnum){
                return method.toUpperCase();
            }
        }
    }

    // use the function name to determinate the method
    // TODO: extand to more word (ie: create/edit/...)
    for(var method in methodEnum){
        if(functionName.toLowerCase().indexOf(method.toLowerCase()) === 0){
            return method.toUpperCase();
        }
    }

    throw new Error('could not determind the correct method for ' + functionName);
}

function getUrls(moduleAnnotations, functionAnnotations){

    var routePrefixs = [];

    // set the route prefix and remove the '/' at its end
    if(moduleAnnotations.routePrefix){

        for(var i in moduleAnnotations.routePrefix){
            routePrefixs.push(moduleAnnotations.routePrefix[i][0]);
        }
    }

    if(routePrefixs.length === 0){
        routePrefixs.push('');
    }

    var urls = [];

    for(var i in routePrefixs){
        for(var j in functionAnnotations.route){

            var url = functionAnnotations.route[j][0];
            urls.push(routePrefixs[i] + url);
        }
    }

    return urls;
}

var methodEnum = {
    get: 0,
    post: 1,
    put: 2,
    delete: 3,
    head: 4,
};

// mimics the path.parse function
function pathParse(fullPath){

    var parsedPath = {
        ext: path.extname(fullPath),
        dir: path.dirname(fullPath),
        full: fullPath,
        base:  path.basename(fullPath),
    };

    parsedPath.name = path.basename(fullPath, parsedPath.ext);

    return parsedPath;
}

function copyObject(object, except){

    if(!except){
        except = [];
    }

    var copy = {};

    for(var i in object){
        if(except.indexOf(i) === -1){
            copy[i] = object[i];
        }
    }

    return copy;
}

function extractControllerAnnotations(annotations){
    return copyObject(annotations, ['routePrefix']);
}

function extractActionAnnotations(annotations){
    return copyObject(annotations, ['route', 'httpGet', 'httpPost', 'httpPut', 'httpDelete', 'httpHead']);
}
