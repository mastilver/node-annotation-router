var path = require('path');

var globby = require('globby');

var annotationParser = require('annotation-parser');

module.exports = function(pattern, eachCallback, finalizeCallback){


    globby(pattern, function(err, matches){

        var matchesResolved = 0;


        // loop through the files
        for(var i = 0, len = matches.length; i < len; i++){

            annotationParser(matches[i], function(err, annotations){

                // loop through the functions
                for(var functionName in annotations.functions){


                    var urls = getUrls(annotations.module.annotations, annotations.functions[functionName].annotations);
                    if(urls.length === 0){
                        continue;
                    }

                    var method = getMethod(annotations.functions[functionName].annotations, functionName);
                    if(method instanceof Error){
                        return finalizeCallback(method);
                    }

                    // loop through the urls (one function can have multiple route)
                    for(var i in urls){
                        eachCallback(null, {
                            url: urls[i],
                            method: method,
                            action: annotations.functions[functionName].ref,
                            actionName: functionName,
                            controllerName: annotations.module.name,
                        });
                    }
                }

                if(++matchesResolved === matches.length){
                    finalizeCallback(null);
                }
            });
        }

        if(matches.length === 0){
            finalizeCallback(null);
        }
    });
};

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

    return new Error('could not determind the correct method for ' + functionName);
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
