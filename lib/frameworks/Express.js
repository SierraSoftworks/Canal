module.exports = {
	registrar: function(app, verb, route, handlers) { 
		var args = [route];
		Array.prototype.push.apply(args, handlers);

		if(!app[verb]) 
			throw new Error('The requested routing verb "' + verb + '" wasn\'t available for the route "' + route + '"');

		app[verb].apply(app, args);
	},
	identifierPreprocessor: function(identifier) {
		if(identifier[0] == '$')
			return ':' + identifier.substr(1);
		return identifier;
	}
};