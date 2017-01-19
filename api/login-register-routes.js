//connection to JAWSDB mysql db
var connection = require('../config/connection.js');

module.exports = function(app){
	//add a new user to mysql db
	//take values from registration form
	//update mysql db using addMember()
	app.post('/adduser', function(req, res){
		var username = req.body.username;
		var password = req.body.password;
		var email = req.body.email;

		addMember(username, password, email);
		createMemberTable(username);
		res.send();
	});

	function addMember(username, password, email){
		var member = {};

		var queryString = `INSERT INTO allusers (username, password, email) VALUES (?, ?, ?);`;
		connection.query(queryString, [username, password, email], function(err, data){
			if (err) throw err;
			// member.id = data
			console.log(data);
		});
	}

	function createMemberTable(newusername){
		var queryString = `CREATE TABLE ` + newusername + ` (id int, url varchar (255), upvoted boolean default 1, uploaded boolean)`;
		connection.query(queryString, function(err, data){
			console.log(data);
		});
	}
}