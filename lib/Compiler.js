var _ = require('lodash');

module.exports = Compile;

function Compile(routes, options) {
	var currentState = new CompilerState(options);
	currentState.path = options.basePath;
	currentState.options = options;


	var compiledRoutes = [];

	function onHandler(verb, handler) {
		var handlers = currentState.getPreprocessors();
		handlers.push(handler);
		compiledRoutes.push({
			method: verb,
			path: currentState.getPath(),
			handlers: handlers
		});
	}

	function onArray(identifier, array) {
		if(_.isPlainObject(array[array.length - 1])) {
			currentState = currentState.newChild();
			var routes = array.splice(array.length - 1, 1)[0];
			currentState.preprocessors = array;

			onRoute(identifier, routes);
			currentState = currentState.parent;
		} else if(typeof array[array.length - 1] == 'function') {
			currentState = currentState.newChild();
			var handler = array.splice(array.length - 1, 1)[0];
			currentState.preprocessors = array;

			onHandler(identifier, handler);
			currentState = currentState.parent;
		}
	}

	function onRoute(path, routes) {
		currentState = currentState.newChild(path);
		for(var k in routes) {
			if(typeof routes[k] == 'function') onHandler(k, routes[k]);
			else if(Array.isArray(routes[k])) onArray(k, routes[k]);
			else onRoute(k, routes[k]);
		}
		currentState = currentState.parent;
	}

	if(Array.isArray(routes)) {
		var actualRoutes = routes.splice(routes.length - 1, 1)[0];
		currentState.preprocessors = routes;

		routes = actualRoutes;
	}

	for(var k in routes) {
		if(typeof routes[k] == 'function') onHandler(k, routes[k]);
		else if(Array.isArray(routes[k])) onArray(k, routes[k]);
		else onRoute(k, routes[k]);
	}

	return compiledRoutes;
}

function CompilerState(parent, identifier) {
	if(!(this instanceof CompilerState)) return new CompilerState(parent, identifier);

	this.parent = parent;
	this.identifier = identifier;
	this.preprocessors = [];
	this.options = null;
}

CompilerState.prototype.newChild = function(identifier) {
	var childState = new CompilerState(this, identifier);
	childState.options = this.options;
	return childState;
};

CompilerState.prototype.getPath = function() {
	var options = this.options;
	var separator = options.pathSeparator || '/';
	var basePath = options.basePath || '/';
	var identifierPreprocessor = options.identifierPreprocessor || function(value) { return value; };

	if(basePath[basePath.length - 1] == separator[separator.length - 1]) 
		basePath = basePath.substr(0, basePath.length - separator.length);

	var path = '';

	var currentState = this;
	while(currentState) {
		if(currentState.identifier !== undefined)
			path = separator + identifierPreprocessor(currentState.identifier) + path;
		currentState = currentState.parent;
	}

	return basePath + path ? path : separator;
};

CompilerState.prototype.getPreprocessors = function() {
	var preprocessors = [];
	var currentState = this;

	while(currentState) {
		Array.prototype.unshift.apply(preprocessors, currentState.preprocessors);
		currentState = currentState.parent;
	}

	return preprocessors;
};
