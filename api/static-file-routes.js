//=================================================
// Static file routes

var path = require('path');

module.exports = function(app){

	app.get('/', function(req,res) {
	res.sendFile(path.join(__dirname, './../public/index.html'));
	});

	app.get('/profile', function(req,res) {
		res.sendFile(path.join(__dirname, './../public/profile.html'));
	});

	app.get('/css/:name', function(req, res) {
		var fileName = req.params.name;
		var options = {
			root: __dirname + './../public/css/',
			dotfiles: 'deny',
			headers: {
			    'x-timestamp': Date.now(),
			    'x-sent': true
			}
		};

		res.sendFile(fileName, options, function (err) {
			if (err) {
				console.log(err);
				res.status(err.status).end();
			}
			else {
				// console.log('Sent:', fileName);
			}
		});
	});

	app.get('/img/:name', function(req, res) {
		var fileName = req.params.name;
		var options = {
			root: __dirname + './../public/img/',
			dotfiles: 'deny',
			headers: {
			    'x-timestamp': Date.now(),
			    'x-sent': true
			}
		};

		res.sendFile(fileName, options, function (err) {
			if (err) {
				console.log(err);
				res.status(err.status).end();
			}
			else {
				// console.log('Sent:', fileName);
			}
		});
	});

	app.get('/app/:name', function(req, res) {
		var fileName = req.params.name;
		var options = {
			root: __dirname + './../app/',
			dotfiles: 'deny',
			headers: {
			    'x-timestamp': Date.now(),
			    'x-sent': true
			}
		};

		res.sendFile(fileName, options, function (err) {
			if (err) {
				console.log(err);
				res.status(err.status).end();
			}
			else {
				// console.log('Sent:', fileName);
			}
		});
	});
}