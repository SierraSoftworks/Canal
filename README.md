# Canal
**A structured routing toolkit for Express**

Canal was designed to make structuring routes in Express as easy as possible by relying on JavaScript objects to design your routes. It allows you to easily manage complex routing strategies while ensuring that the code remains readable and navigatable.

## Usage
Using Canal is extremely simple, just add a dependency to your *package.json* file or run `npm install canal` from the terminal.

## Example
```javascript
var express = require('express'),
	canal = require('canal');

var app = express();
app.use(express.bodyParser());
app.use(app.router);

var routes = {
	// GET /
	get: function(req, res) {
		return res.render('index');
	},

	login: {
		// GET /login
		get: function(req, res) {
			return res.render('login')
		},
		// POST /login
		post: function(req, res) {
			// login logic
			return res.redirect('/');
		}
	},
	user: [checkLogin, {
		// Translated into a placeholder
		$username: {
			get: function(req, res) {

			}
		}
	}]
};

canal(app, routes);

app.listen(process.env.port || 3000);
```

## Features
- **Structured Route Design**
  Canal allows you to design your routes by following a proven set of guides which ensure that your routes are easy to understand, extend and modify.
- **Tree Based Structure**
  Your routes are tree-based, so why should you be forced to use a linear design approach? Embrace the power of JavaScript's object maps and realize just how easily complex routes can be designed and managed.
- **Powerful Syntax**
  Canal allows for complex routing paradigms, including the use of Express' chained route handling while still keeping the syntax as simple as possible. Don't believe us? Try it out for yourself.

## API
Canal's API consists of a single function which allows you to register routes with an application.

```javascript
function Canal(app, routes, options = Canal.options);

Canal.options = {
	registrar: Canal.Express.registrar,
	idenfifierPreprocessor: Canal.Express.identifierPreprocessor,
	basePath: '/',
	separator: '/'
};
```

### Routes Syntax
The routes used by Canal are formed by creating a nested JavaScript map object describing the different path branches. Each laef represents the path component at the depth of the branch it is linked to, so the path */user/login* would be represented by the object `{ user: { login: {} } }`. Each leaf can specify functions to handle different verbs (get, post, delete etc.). 

#### Basic Routes
Basic routes are defined by creating an object like the following. Canal will attempt to register functions as route handlers, using their property name as the verb.

```javascript
var routes = {
	get: function(req, res) { },

	user: {
		get: function(req, res) { },
		post: function(req, res) { }
	}
};
```

#### Placeholders
To further extend the power of routes, placeholders can be used, indicated by the presence of a *$* sign before the name of the placeholder. These placeholders should be registered with Express using the `app.param()` function before they will work.

```javascript
var routes = {
	get: function(req, res) { },

	$username: {
		get: function(req, res) { },
		post: function(req, res) { }
	}
};
```

#### Cascading Routes
Sometimes it's necessary to include request preprocessors on specific routes. For example, the ability to ensure that a user is signed in for any administrative routes is a common use case, and one that can be handled by a route preprocessor. Canal allows these preprocessors to be implemented very easily through the use of arrays as leaves in the route tree.

```javascript
var routes = {
	get: function(req, res) { },

	admin: [ensureLogin, {
		get: function(req, res) { },
		pages: {
			get: [populatePages, function(req, res) { }]
		}
	}]
};
```

Cascading handlers are applied to all child routes when they appear with an Object as the last element, while they are implemented only for the given handler if the last element in the array is a function.