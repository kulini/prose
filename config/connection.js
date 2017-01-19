//npm mysql package
var mysql = require('mysql');

//npm package to store sensitive info, e.g. login parameters
require('dotenv').config();

//parameters to establish mysql connection
var connection = mysql.createConnection({
	host: process.env.dbhost,
	port: 3306,
	user: process.env.dbuser,
	password: process.env.dbpassword,
	database: process.env.dbname
});


module.exports = connection;