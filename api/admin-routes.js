//connect to JAWSDB mysql db
var connection = require('../config/connection.js');

//npm package to extract the most dominant color from a photo,
//and break down the dominant color to RGB component values
var dominantColor = require('dominant-color');

//external file to store URLs that will be uploaded to mysql db
var photosArray = require('./photoURLs.js');

module.exports = function(app){

	//Retrieve info of all members. For testing only.
	app.get('/members', function(req, res){
		var queryString = `SELECT * FROM allusers`;
		connection.query(queryString, function(err, data){
			res.send(data);
		});
	});


	//Reset alluser table to default value of 0 for each color
	function resetMemberColors(){
		var queryString = `UPDATE allusers SET red=130, green=130, blue=130, bwCount=0, upvotes=0`;
		connection.query(queryString, function(err, data){
			if (err) throw err;
			console.log(data);
		});
	}
	//uncomment line below to execute
	// resetMemberColors();


	//From thumbnail photo URL, return URL of uncompressed photo
	//callback function here is shortenURL()
	function largePhotoURL(photoID, callback){
		var queryString = 'SELECT url FROM photos WHERE id=?';
		connection.query(queryString, [photoID], function(err, data){
			var url;
			if (err) throw err;
			url = data[0].url;
			callback(url);		
		});	
	} 
	//callback function in largePhotoURL()
	function shortenURL(url){
		var url = url;
		//index of '?', which is the beginning of the URL extension for compressed photos	
		var indexOfQ = url.indexOf('?h');
		console.log(indexOfQ);
		//truncate URL, beginning with '?'
		var uncompressedURL = url.substring(0, indexOfQ);
		console.log(uncompressedURL);
	}

	//master function that uploads new photos to the mysql db
	//this function uses a callbackfunction
	//'colorCallback', which uses dominant-color npm package to identify rgb values of the dominant color in a photo
	//'colorCallback' argument is function 'queryForDominantColor()'
	//queryForDominantColor(), in turn, calls addPhotoToDb(), which uploads photo info to mysql db.		
	function findColorAndUploadToDb(colorCallback){
		for (var i = 0; i < photosArray.length; i++){
			//identify the dominant color in the photo, then identify which of r, g, or b is dominant in that color
			//function call using npm package dominant-color
			var photoURL= photosArray[i];
			colorCallback(photoURL);
			
		}//END for loop
	} //END findDominantColor()


	//this is a callback function: 'colorCallback' parameter in findColorUploadToDb()
	//this function 1. finds the rgb values of the dominant color in a photo, then
	//2. calls addPhotoToDb() to upload its url and color values to the mysql db.

	//An explanation of the color-related variables:
	//A. Every photo has a dominant color
	//B. The dominant color is broken down into its RGB components
	//C. of the RGB components, the largest value of the three is identified as 'dominantHue'
	function queryForDominantColor(photoURL){
		//RGB values of the dominant color
		var red;
		var green;
		var blue;

		//default value of the dominant hue (R, G, B) of the dominant color in the photo
		var dominant = 0;
		//the index of the largest of the R, G, and B values
		var indexOfDominant;
		//of R, G, B, the hue whose value is largest
		var dominantHue;

		//object containing the photo URL, as well as the dominant color's RGB values
		var infoObj = {};

		dominantColor(photoURL, {format: 'rgb'}, function(err, color){
		  //'color' from callback function above is an array of RGB values of the dominant color
		  //if color[0], color[1], and color[2], i.e. RGB values, are identical, it is a B&W photo
		  //dominant color, or 'dominantHue' is therefore identified as 'bw'
		  if ((color[0] === color[1]) && (color[1] === color[2])){
		  	dominantHue = 'bw';
		  }

		  //otherwise, identify which of R, G, or B, is strongest of the dominant color
		  else {
		  	//loop through color array, and identify which element is largest, i.e. R, G, or B
		  	for (var j = 0; j < color.length; j++){
		  	  if (Number(color[j])> dominant) dominant = color[j];
			}
			//find the index of the largest value in the 'color' array
		    indexOfDominant = color.indexOf(dominant);
		    //if index of largest value in the array is 0, the dominant hue is red. if 1, then green. if 2, blue.
		    if (indexOfDominant == 0) dominantHue = 'red';
		    else if (indexOfDominant == 1) dominantHue = 'green';
		    else if (indexOfDominant == 2) dominantHue = 'blue';
		  }
		  
		  // console.log(indexOfDominant);
		  // console.log(photoURL);

		  //properties of the infoObj, which will be added to the mysql db
		  infoObj['url'] = photoURL;
		  infoObj['red'] = color[0];
		  infoObj['green'] = color[1];
		  infoObj['blue'] = color[2];
		  infoObj['dominant'] = dominantHue;
		  // console.log(infoObj.dominant);

		  //this function adds entries to the 'photo' table of the mysql db
		  addPhotoToDb(infoObj);  
		}); //END dominantColor
	}

	//this function is called by queryDominantColor();
	//upload info about new photos to mysql db
	//parameter 'infoObj' is obtained from queryForDominantColor()
	function addPhotoToDb(infoObj){

		var queryString = 'INSERT INTO photos (url, red, green, blue, dominant) VALUES (?, ?, ?, ?, ?)';
		connection.query(queryString, [infoObj.url, infoObj.red, infoObj.green, infoObj.blue, infoObj.dominant], function(err, data){
			if (err) throw err;
			console.log(data);
		});
	}	

	//add photo entries to mysql/jaws db
	// findColorAndUploadToDb(queryForDominantColor); 
}