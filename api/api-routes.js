// ===============================================================================
// ROUTING
// ===============================================================================
var connection = require('../config/connection.js');

//directory in which api routes and functions exist
var api = require('../api');

module.exports = function(app){
	//Route to display mysql photo db. display result up to 1000 entries
	app.get('/api', function(req,res) {
		connection.query(`SELECT * FROM photos LIMIT 1000;`, function(err, data){
			if (err) throw err;
			res.send(data);
		});
	});

	//route to display next nine images, when an image is clicked
	app.get('/api/nextImage/:photoID/:variance', function(req, res) {

		const photoID = req.params.photoID;
		const userVariance = req.params.variance;

		api.nextImage(photoID, userVariance)
		.then(function(data) {
			res.send(data);
		});
	});

	//return current RGB profile of the user
	//result will be displayed on the front end
	//as evolving background color
	//corresponding get route
	app.get('/userRGB/:userid', function(req, res){
		var userid = req.params.userid;
		var queryString = `SELECT * FROM allusers WHERE username=?;`;
		connection.query(queryString, [userid], function(err, data){
			var rgbProfile ={};
			rgbProfile.red = data[0].red;
			rgbProfile.green = data[0].green;
			rgbProfile.blue = data[0].blue;
			rgbProfile.bw = data[0].bw;
			console.log(rgbProfile);
			res.send(rgbProfile);
		});	
	});


	//Route for upvoting a user's RGB/color profile
	//this post route is called when a user clicks/upvotes a photo

	app.post('/upvoteUserColors/:user', function(req, res){
		var userid = req.params.user;
		var data = req.body;
		var dominant = req.body.dominant;
		var url = req.body.url;
		var photoid = req.body.id;

		console.log('userid: ' + userid);

		upvoteUserColors(dominant, userid);
		updateUserTable(userid, photoid, url);
		res.send();
	});



	//Upvote route
	//==========================================================
	// //function to update a user's color value
	// //this function is called when the user clicks on a photo
	// //'color' parameter is the dominantHue of the clicked photo
	function upvoteUserColors(color, userID){
		var queryString; 

		switch(color) {
			case 'red':
				queryString = 
				`UPDATE allusers
					SET red = CASE
					   WHEN red <= 235 THEN red+20
					   ELSE red
					END,
						green = CASE
					    WHEN green >= 10 THEN green-10
					    ELSE green
					END,
						blue = CASE
					    WHEN blue >= 10 THEN blue-10
					    ELSE blue
					END
				WHERE username=` + `'` + userID+ `';`;
				break;

			case 'green':
				queryString = 
				`UPDATE allusers
					SET green = CASE
					   WHEN green <= 235 THEN green+20
					   ELSE green
					END,
						red = CASE
					    WHEN red >= 10 THEN red-10
					    ELSE red
					END,
						blue = CASE
					    WHEN blue >= 10 THEN blue-10
					    ELSE blue
					END
				WHERE username=` + `'` + userID+ `';`;
				break;

			case 'blue':
				queryString = 
				`UPDATE allusers
					SET blue = CASE
					   WHEN blue <= 235 THEN blue+20
					   ELSE blue
					END,
						red = CASE
					    WHEN red >= 10 THEN red-10
					    ELSE red
					END,
						green = CASE
					    WHEN green >= 10 THEN green-10
					    ELSE green
					END
				WHERE username=` + `'` + userID+ `';`;
				break;

			case 'bw':
				queryString = `UPDATE allusers SET bwCount=bwCount+1, upvotes=upvotes+1 WHERE username=` + `'` + userID+ `';`;
		}

		connection.query(queryString, function(err, data){
			if (err) throw err;
			console.log(data);
		});
	}

	function updateUserTable(userID, photoID, url){
		var queryString = `INSERT INTO ` + userID + ` (id, url) VALUES (?, ?)`;
		connection.query(queryString, [photoID, url], function(err, data){
			if (err) throw err;
			console.log(data);
		});
	}



	//Downvote route
	//=======================================

	app.post('/downvoteUserColors/:user', function(req, res){
		var userid = req.params.user;
		var data = req.body;
		var dominant = req.body.dominant;
		var url = req.body.url;
		var photoid = req.body.id;

		console.log('userid: ' + userid);

		downvoteUserColors(dominant, userid);
		res.send();
	});


	// //function to update a user's color value
	// //this function is called when the user downvotes a photo
	// //'color' parameter is the dominantHue of the clicked photo
	function downvoteUserColors(color, userID){
		var queryString; 

		switch(color) {
			case 'red':
				queryString = 
				`UPDATE allusers
					SET red = CASE
					   WHEN red >= 10 THEN red-10
					   ELSE red
					END,
						green = CASE
					    WHEN green <= 250 THEN green+5
					    ELSE green
					END,
						blue = CASE
					    WHEN blue <= 250 THEN blue+5
					    ELSE blue
					END
				WHERE username=` + `'` + userID+ `';`;
				break;

			case 'green':
				queryString = 
				`UPDATE allusers
					SET green = CASE
					   WHEN green >= 10 THEN green-10
					   ELSE green
					END,
						red = CASE
					    WHEN red <= 250 THEN red+5
					    ELSE red
					END,
						blue = CASE
					    WHEN blue <= 250 THEN blue+5
					    ELSE blue
					END
				WHERE username=` + `'` + userID+ `';`;
				break;

			case 'blue':
				queryString = 
				`UPDATE allusers
					SET blue = CASE
					   WHEN blue >= 10 THEN blue-10
					   ELSE blue
					END,
						red = CASE
					    WHEN red <= 250 THEN red+5
					    ELSE red
					END,
						green = CASE
					    WHEN green <= 250 THEN green+5
					    ELSE green
					END
				WHERE username=` + `'` + userID+ `';`;
				break;

			case 'bw':
				queryString = `UPDATE allusers SET bwCount=bwCount-1, downvotes=downvotes+1 WHERE username=` + `'` + userID+ `';`;
		}

		connection.query(queryString, function(err, data){
			if (err) throw err;
			console.log(data);
		});
	}


	//Route to delete a photo from profile page
	//=====================================================
	app.post('/delete/:photoID/:userID', function(req, res){
		var photoid = req.params.photoID;
		var userid = req.params.userID;
		var data = req.body;

		deleteUserPhoto(userid, photoid);
		res.send();
	});

	function deleteUserPhoto(userId, photoId){
		var queryString = `DELETE FROM ` + userId + ` WHERE id=` + photoId + `;`;
		connection.query(queryString, function(err, data){
			console.log(data);
		});
	}

	// //get route for the profile page
	// app.get('/profile/:user', function(req, res){
	// 	var user = req.params.user;
	// 	var queryString = `SELECT * FROM ` + user;
	// 	connection.query(queryString, function(err, data){
	// 		res.send(data);
	// 	});
	// });


	//Route to reset a user's color profile
	//=====================================================
	app.get('/reset/:user', function(req, res){
		var userId = req.params.user;
		console.log(userId);
		var queryString = `UPDATE allusers SET red=130, green=130, blue=130 WHERE username='` + userId + `';`;
		connection.query(queryString, function(err, data){
			// console.log(data);
		});
		res.send();
	});

	//Route to query a user's color variance value
	//=====================================================
	app.get('/variance/:user', function(req, res){
		var userId = req.params.user;
		var queryString = `SELECT variance FROM allusers WHERE username='` + userId + `';`;
		connection.query(queryString, function(err, data){
			console.log(data[0].variance);
			res.send(data[0].variance.toString());
		});
	});

	//Route to alter a user's color variance value
	//=====================================================	
	app.get('/setvariance/:user/:variance', function(req, res){
		var userId = req.params.user;
		var varValue = req.params.variance;
		var queryString = `UPDATE allusers SET variance=` + varValue + ` WHERE username='` + userId + `';`;
		connection.query(queryString, function(err, data){
			if (err) throw err;
			console.log(data);
		});
	});

	//Currently unused routes. may need later.
	//===============================================================

	// //route where :user is a specific user in the allusers table
	// //Returns the user's ID in the allusers table
	// app.get('/match/:user', function(req, res){
	// 	//req.params.user corresponds to ':user' in the route
	// 	var user = req.params.user;
	// 	var queryString = `SELECT * FROM allusers WHERE username='` + user + `';`;
	// 	connection.query(queryString, function(err, data){
	// 		if (err) throw err;
	// 		console.log(data[0].id);
	// 		// res.send(data[0].id.toString());
	// 		return data[0].id;
	// 	});
	// });

	//route to display photos completely randomly
	//for users who aren't logged in
	// app.get('/photos', function(req, res){
	// 	var queryString = `SELECT * FROM photos;`;

	// 	connection.query(queryString, function(err, data){
	// 		var photoArray = [];
	// 		var photoCount = data.length;
	// 		for (var i = 0; i < 9; i++){
	// 			var random = Math.floor((Math.random() * photoCount));
	// 			var url = data[random].url
	// 			photoArray.push(url);
	// 			// shortenURL(url);
	// 		}
	// 		res.send(photoArray);
	// 	});
	// });

}