var should = require('should'),
	Canal = require('../'),
	compiler = require('../lib/Compiler.js');

describe('Compiler', function() {
	it('should export a function', function() {
		should.exist(compiler);
		compiler.should.be.type('function');
	});

	it('should correctly compile simple routes', function() {
		var routeFunction = function() { }
		var routes = {
			get: routeFunction,
			user: {
				get: routeFunction,
				post: routeFunction
			}
		};

		var expected = [
			{ method: 'get', path: '/', handlers: [routeFunction] },
			{ method: 'get', path: '/user', handlers: [routeFunction] },
			{ method: 'post', path: '/user', handlers: [routeFunction] }
		];

		var compiled = compiler(routes, Canal.options);
		should.exist(compiled);
		compiled.should.eql(expected);
	});

	it('should correctly convert placeholders', function() {
		var routeFunction = function() { }
		var routes = {
			get: routeFunction,
			$user: {
				get: routeFunction,
				post: routeFunction
			}
		};

		var expected = [
			{ method: 'get', path: '/', handlers: [routeFunction] },
			{ method: 'get', path: '/:user', handlers: [routeFunction] },
			{ method: 'post', path: '/:user', handlers: [routeFunction] }
		];

		var compiled = compiler(routes, Canal.options);
		should.exist(compiled);
		compiled.should.eql(expected);
	});

	it('should correctly compile routes with path preprocessors', function() {
		var routeFunction = function() { }
		var routes = {
			get: routeFunction,
			user: [routeFunction, {
				get: routeFunction,
				post: routeFunction
			}]
		};

		var expected = [
			{ method: 'get', path: '/', handlers: [routeFunction] },
			{ method: 'get', path: '/user', handlers: [routeFunction, routeFunction] },
			{ method: 'post', path: '/user', handlers: [routeFunction, routeFunction] }
		];

		var compiled = compiler(routes, Canal.options);
		should.exist(compiled);
		compiled.should.eql(expected);
	});

	it('should correctly compile routes with handler preprocessors', function() {
		var routeFunction = function() { }
		var routes = {
			get: routeFunction,
			user: {
				get: [routeFunction, routeFunction],
				post: routeFunction
			}
		};

		var expected = [
			{ method: 'get', path: '/', handlers: [routeFunction] },
			{ method: 'get', path: '/user', handlers: [routeFunction, routeFunction] },
			{ method: 'post', path: '/user', handlers: [routeFunction] }
		];

		var compiled = compiler(routes, Canal.options);
		should.exist(compiled);
		compiled.should.eql(expected);
	});

	it('should correctly inherit preprocessors', function() {
		var routeFunction = function() { }
		var routes = {
			get: routeFunction,
			admin: [routeFunction, {
				user: [routeFunction, {
					get: routeFunction,
					post: routeFunction
				}]
			}]
		};

		var expected = [
			{ method: 'get', path: '/', handlers: [routeFunction] },
			{ method: 'get', path: '/admin/user', handlers: [routeFunction,routeFunction,routeFunction] },
			{ method: 'post', path: '/admin/user', handlers: [routeFunction,routeFunction,routeFunction] }
		];

		var compiled = compiler(routes, Canal.options);
		should.exist(compiled);
		compiled.should.eql(expected);
	});

	it('should allow registration of global preprocessors', function() {
		var routeFunction = function() { }
		var routes = {
			get: routeFunction,
			user: {
				get: routeFunction,
				post: routeFunction
			}
		};

		var expected = [
			{ method: 'get', path: '/', handlers: [routeFunction, routeFunction] },
			{ method: 'get', path: '/user', handlers: [routeFunction, routeFunction] },
			{ method: 'post', path: '/user', handlers: [routeFunction, routeFunction] }
		];

		var compiled = compiler([routeFunction, routes], Canal.options);
		should.exist(compiled);
		compiled.should.eql(expected);
	})
});
