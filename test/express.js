var should = require('should'),
	Canal = require('../'),
	Express = require('./utils/express.js');

describe('Express integration', function() {
	it('should correctly register routes with Express', function() {
		var routeFunction = function() { }
		var routes = {
			get: routeFunction,
			user: {
				get: routeFunction,
				post: routeFunction
			}
		};

		var expected = {
			get: [{ path: '/', handlers: [routeFunction] }, { path: '/user', handlers: [routeFunction] }],
			post: [{ path: '/user', handlers: [routeFunction] }],
			delete: []
		};

		var app = Express();

		Canal(app, routes);
		app.routes.should.eql(expected);
	});
});