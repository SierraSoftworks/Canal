var should = require('should');

module.exports = Express;

function Express() {
	if(!(this instanceof Express)) return new Express();

	this.routes = {

	};

	var $ = this;
	var methods = ['get', 'post', 'delete'];
	methods.forEach(function(method) {
		$.routes[method] = [];
		$[method] = function() {
			var args = Array.prototype.slice.call(arguments, 0);
			args.length.should.not.be.lessThan(2, "Registrar didn't pass all arguments to the function");
			should(!Array.isArray(args[1]), "Registrar passed handlers as an array, should be positional arguments");

			var path = args.shift();
			var handlers = args;

			$.should.equal(this, "Registrar didn't maintain correct this reference for application");

			$.routes[method].push({ path: path, handlers: handlers });
		};
	});
}