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

var logger = require('morgan');
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

// Log every request to console
app.use(logger('dev'));
// Serve local files
// app.use(express.static('./public'));

//Express middleware for parsing info for http POST requests
//================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));


// app.get('/css/:name', function(req, res) {
// 	var fileName = req.params.name;
// 	var options = {
// 		root: __dirname + './../public/assets/css/',
// 		dotfiles: 'deny',
// 		headers: {
// 		    'x-timestamp': Date.now(),
// 		    'x-sent': true
// 		}
// };

// app.get('/img/:name', function(req, res) {
// 	var fileName = req.params.name;
// 	var options = {
// 		root: __dirname + './../public/img/',
// 		dotfiles: 'deny',
// 		headers: {
// 		    'x-timestamp': Date.now(),
// 		    'x-sent': true
// 		}
// 	};

// 	res.sendFile(fileName, options, function (err) {
// 		if (err) {
// 			console.log(err);
// 			res.status(err.status).end();
// 		}
// 		else {
// 			// console.log('Sent:', fileName);
// 		}
// 	});
// });

//establish connection to mysql/jawsdb
connection.connect(function(err){
	if (err){
		console.error(err.stack);
	}
	console.log('connected as ID ' + connection.threadId);
});

//serve static files
app.get('/', function(req, res){
	// res.send('smile! you are alive!');
	res.sendFile(path.resolve(__dirname, 'public/index2.html'));
});


//send all sentences



app.get('/sentences', function(req, res){
	var queryString = `SELECT * FROM sentences`;
	connection.query(queryString, function(err, data){
		res.send(data);
	});
});

//retrieve only sentences that contain revision
//probably will filter at the front end instead of using this.
app.get('/revisedsentences', function(req, res){
	var queryString = `SELECT * FROM sentences`;
	var result = '';
	connection.query(queryString, function(err, data){
		var len = data.length;

		for (var i = 0; i < len; i++){
			// console.log(data[i]);
			var random = Math.floor(Math.random() * len);
			//select for sentences with revisions
			if (data[i].revised === 1){
				console.log(data[random]);
			}
		}
		// res.json(data);
		// res.status(201).end();
	});
});



//replace 'get' with 'post' later. 'get' was used to test without using postman
//route to add a new sentence to the sentences table
app.post('/addsentence', function(req, res){
	var text = req.body.original;
	if (!text) res.end();
	console.log(text);
	// var test = `When we access our good side we'll remember each other with fondness`;
	var queryString = "INSERT INTO sentences (original) VALUES(?)";

	connection.query(queryString, [text], function(err, data){
		if (err) throw err;
		console.log(data.insertId);
		var sentenceID = data.insertId;
	  var tableName = 'sentence'+sentenceID;

		res.send();
		console.log(queryString);
		var queryString2 = `CREATE TABLE ${tableName} (id int(11) AUTO_INCREMENT, revision varchar (2048) NOT NULL, upvotes int(11) DEFAULT 0, downvotes int(11) DEFAULT 0, PRIMARY KEY (id))`;

	  connection.query(queryString2, function(err, data){
	  	if (err) throw err;
	  	console.log(queryString2);
	  	console.log(sentenceID);
	  	res.status(201);
	  });
	});
});

//replace 'get' with 'post' later
//route to add a revised version of a sentence to an existing sentence

app.post('/addrevision/:id', function(req, res){
	var sentenceID = 'sentence' + req.params.id;
	// var testID = 'sentence1';
	//text is req.body.revision because it is sent from from end as {revision: text}
	var text = req.body.revision;
	// var sampleText = ``;
	console.log(text);
	var queryString = `INSERT INTO ${sentenceID} (revision) VALUES (?)`;
	connection.query(queryString, [text], function(err, data){
		// res.status(201);
		if (err) throw err;
		res.send();
		console.log(data);
	});

	var queryString2 = `UPDATE sentences SET revised = true WHERE id=${req.params.id}`;
	connection.query(queryString2, function(err, data){
		if (err) throw err;
		res.send();
	});
});

//upvote a particular revision of a sentence
app.get('/upvote/:sentenceID/:revisionID', function(req, res){
	var sentenceID = 'sentence' + req.params.sentenceID;
	var revisionID = req.params.revisionID;
	var queryString = `UPDATE ${sentenceID} SET upvotes = upvotes + 1 WHERE id = ${revisionID}`;
	connection.query(queryString, [sentenceID], function(err, data){
		if (err) throw err;
		res.send('success');
	});
});


//send revisions of a specific original sentence
app.get('/revisions/:id', function(req, res){
	var id = req.params.id;
	var sentenceID = 'sentence'+id;
	var queryString = `SELECT * FROM ${sentenceID}`;
	connection.query(queryString, function(err, data){
		res.json(data);
	});
});


//External routing files
//================================================
// require('./api/api-routes.js')(app);
// require('./api/admin-routes.js')(app);
// require('./api/login-register-routes.js')(app);
require('./api/static-file-routes.js')(app);

