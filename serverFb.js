//Imported modules
//============================================================
//npm server package
var express = require('express');
//npm package used to obtain information from ajax calls
var bodyParser = require('body-parser');
//npm package to handle file pathways
var path = require('path');
//module to establish mysql connection with Jaws DB
var connection = require('./config/connection.js');

//Facebook Auth Deps
var passport = require("passport");
var Strategy = require("passport-facebook").Strategy;

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

// Passport / Facebook Authentication Information
passport.use(new Strategy({
  clientID: process.env.CLIENT_ID || "152484428585251",
  clientSecret: process.env.CLIENT_SECRET || "5f21878833ee5b0aadea898784fdcfc6",
  callbackURL: "http://localhost:3000"
},
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user"s Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application"s database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

  // Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
//
// If the above doesn"t make sense... don"t worry. I just copied and pasted too.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Here we start our Passport process and initiate the storage of sessions (i.e. closing browser maintains user)
app.use(passport.initialize());
app.use(passport.session());

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
		//data.insertId is the id of the original sentence assigned by mysql/jaws db.
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

	var queryString2 = `UPDATE sentences SET revised = revised + 1 WHERE id=${req.params.id}`;
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

// registration route

app.post('/register', function(req, res){
	var reginfo = req.body;
	// console.log(reginfo.regfirst);
	var first = reginfo.regfirst;
	var last = reginfo.reglast;
	var username = reginfo.regusername;	
	var password = reginfo.regpassword;
	var email = reginfo.regemail;


	var userqueryString = "INSERT INTO Users (firstname, lastname, username, userpassword, email) VALUES(?, ?, ?, ?, ?)";

	console.log(password);
	//mysql query made to jawsdb
	connection.query(userqueryString, [first, last, username, password, email], function(err, data){
		if (err) throw err;
		console.log(data)
		console.log(data.insertId);
		// var userID = data.insertId;
	  var tableName = username;

		res.send();
		console.log(userqueryString);
		var userqueryString2 = `CREATE TABLE ${tableName} (id int(11) AUTO_INCREMENT, creator boolean default false, originalId int(11), reviseId int(11), upvotes boolean default false, revisor boolean default false, PRIMARY KEY (id))`;

	  connection.query(userqueryString2, function(err, data){
	  	if (err) throw err;
	  	console.log(userqueryString2);
	  	res.status(201);
	  });
	});
});

//login route
app.post('/login', function(req, res){
	var loginfo = req.body;

	var logusername = loginfo.logusername;
	var logpassword = loginfo.logpassword;

	console.log(loginfo);

	var loginqueryString = `SELECT * FROM Users WHERE username=?`;

	connection.query(loginqueryString, [logusername], function(err, data){
		if (err) throw err;
		console.log(data);
		// var userID = data.insertId;
		if (data.userpassword === logpassword){
			res.status(200);
		}
		else {
			//http://stackoverflow.com/questions/29595770/res-success-back-to-frontend-from-a-node-js-express-app
			res.status(400);
		}
	});
});

//External routing files
//================================================
// require('./api/api-routes.js')(app);
// require('./api/admin-routes.js')(app);
// require('./api/login-register-routes.js')(app);
require('./api/static-file-routes.js')(app);

