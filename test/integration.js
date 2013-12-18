var should = require('should'),
	Canal = require('../');

describe('integration', function() {
	function newApp() {
		return {
			get: [],
			post: []
		};
	}

	it('should correctly populate routes', function() {
		var routeFunction = function() { }
		var routes = {
			get: routeFunction,
			user: {
				get: routeFunction,
				post: routeFunction
			}
		};

		var app = newApp();

		var expected = {
			get: [
				{ path: '/', handlers: [routeFunction] },
				{ path: '/user', handlers: [routeFunction] }
			],
			post: [
				{ path: '/user', handlers: [routeFunction] }
			]
		};

		Canal(app, routes, {
			registrar: function(app, verb, path, handlers) {
				app[verb].push({ path: path, handlers: handlers });
			}
		});
		should.exist(app);
		app.should.eql(expected);
	});
});