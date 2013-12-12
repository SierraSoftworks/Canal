module.exports = Canal;

var compiler = require('./Compiler'),
	_ = require('lodash');

function Canal(app, routes, options) {
	/// <signature>
	/// <summary>Registers the provided routes with the given application</summary>
	/// <param name="app" type="Express">The application on which the routes should be registered</param>
	/// <param name="routes" type="Object">The routes to register with the application</param>
	/// </signature>
	/// <signature>
	/// <summary>Registers the provided routes with the given application</summary>
	/// <param name="app" type="Express">The application on which the routes should be registered</param>
	/// <param name="routes" type="Object">The routes to register with the application</param>
	/// <param name="options" type="Object">The options which override the defaults set by Canal.options</param>
	/// </signature>

	if(!options) options = {};
	_.defaults(options, Canal.options);

	var compiled = compiler(routes, options);
	for(var i = 0; i < compiled.length; i++) {
		var route = compiled[i];
		options.registrar(app, route.method, route.path, route.handlers);
	}
}

Canal.Express = require('./frameworks/Express.js');

var options = {
	registrar: Canal.Express.registrar,
	identifierPreprocessor: Canal.Express.identifierPreprocessor,
	basePath: '/',
	pathSeparator: '/'
};

Object.defineProperty(Canal, 'options', {
	get: function() { return options; }
});

Canal.routes = function(routes, options) {
	/// <signature>
	/// <summary>Gets all routes defined in the given routing table</summary>
	/// <param name="routes" type="Object">The routes to expand for the route list</param>
	/// </signature>
	/// <signature>
	/// <summary>ets all routes defined in the given routing table</summary>
	/// <param name="routes" type="Object">The routes to expand for the route list</param>
	/// <param name="options" type="Object">The options which override the defaults set by Canal.options</param>
	/// </signature>

	if(!options) options = {};
	_.defaults(options, Canal.options);

	var compiled = compiler(routes, options);

	var output = {};

	for(var i = 0; i < compiled.length; i++) {
		var route = compiled[i];
		if(!output[route.method])
			output[route.method] = [];
		output[route.method].push(route.path);
	}

	return output;
}