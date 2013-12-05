module.exports = {
	registrar: function(app, verb, route, handlers) { 
		var args = [route];
		args.push(handlers);

		if(!app[verb]) 
			throw new Error('The requested routing verb "' + verb + '" wasn\'t available for the route "' + route + '"');

		app[verb].apply(this, args);
	},
	identifierPreprocessor: function(identifier) {
		if(identifier[0] == '$')
			return ':' + identifier.substr(1);
		return identifier;
	}
};