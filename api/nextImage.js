var mysql = require('mysql');

//parameters to establish mysql connection
var connection = mysql.createConnection({
	host: process.env.dbhost,
	port: 3306,
	user: process.env.dbuser,
	password: process.env.dbpassword,
	database: "heisodbf0ehdxjh4",
});

var nextImage = function(photoID, userVariance) {

	var variance = userVariance;

	return new Promise(function(resolve, reject) {

		// Based on current UserId get the R, G, B, BW values from the User table.

		connection.query('SELECT red, green, blue FROM `photos` WHERE id = ?', [ photoID ], function(err, data){

			if (err) reject(err);

			resolve({
				red: data[0].red,
				blue: data[0].blue,
				green: data[0].green,
				// bw: data[0].bw
			});

		});

	}).then(function(results) {

		// Generate the minimums and maximums for the next query
		const minimums = {
			red: colorFloor(results.red - variance),
			green: colorFloor(results.green - variance),
			blue: colorFloor(results.blue - variance),
			// bw: colorFloor(results.bw - variance)
		};

		const maximums = {
			red: colorCeil(results.red + variance),
			green: colorCeil(results.green + variance),
			blue: colorCeil(results.blue + variance),
			// bw: colorCeil(results.bw + variance)
		};


		// Query the DB for 9 images matching the minimums and maximums
		return new Promise(function(resolve, reject) {

			const query = 'SELECT * FROM photos AS p WHERE p.red >= ? AND p.red <= ? AND p.green >= ? AND p.green <= ? AND p.blue >= ? AND p.blue <= ?';
			const parameters = [
				minimums.red,
				maximums.red,
				minimums.green,
				maximums.green,
				minimums.blue,
				maximums.blue
			];

			connection.query(query, parameters, function(err, data){
				if (err) reject(err);

				// Shuffle the results then return the first 9
				let results = data;
				shuffle(results);
				results = results.slice(0, 9);

				resolve(results);

			});
		});
	});

	function colorFloor(value) {
		if(value < 0) {
			return 0;
		} else {
			return value;
		}
	}

	function colorCeil(value) {
		if(value > 255) {
			return 255;
		} else {
			return value;
		}
	}

	// http://stackoverflow.com/a/6274381/6670038
	function shuffle(a) {
	    for (let i = a.length; i; i--) {
	        let j = Math.floor(Math.random() * i);
	        [a[i - 1], a[j]] = [a[j], a[i - 1]];
	    }
	}
};

module.exports = nextImage;

