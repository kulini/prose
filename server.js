//Imported modules
//============================================================
//npm server package
var express = require('express');
//npm package used for 
var bodyParser = require('body-parser');
//npm package to handle file pathways
var path = require('path');
//module to establish mysql connection with Jaws DB
var connection = require('./config/connection.js');
//npm module 'dot-env'; deal with sensitive info
require('dotenv').config();

//Run express app
//================================================
var app = express();
var PORT = process.env.PORT || 3000;
//App listener
app.listen(PORT, function(){
	console.log('Listening on port: ' + PORT);
});

//Express middleware for parsing info for http POST requests
//================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

//establish connection to mysql/jawsdb
connection.connect(function(err){
	if (err){
		console.error(err.stack);
	}
	console.log('connected as ID ' + connection.threadId);
});


app.get('/sentences', function(req, res){
	var queryString = `SELECT * FROM sentences`;
	var result = '';
	connection.query(queryString, function(err, data){
		// console.log(res);
		console.log(res);
		res.json(data);
	});
});


//External routing files
//================================================
// require('./api/api-routes.js')(app);
// require('./api/admin-routes.js')(app);
// require('./api/login-register-routes.js')(app);
require('./api/static-file-routes.js')(app);

