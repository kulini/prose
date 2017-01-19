var userid = localStorage.getItem('userid');

var userVariance = localStorage.getItem('userVariance');

$(document).ready(function(){
	getLoggedUserColors(userid);
});

//When 'My Photos' tab is clicked, the window reloads
$('#profilepane').on('click', function(){
	window.location.reload();
	getLoggedUserColors(userid);
});


//Function to reset user's color profile to default RGB values of 130, 130, 130
$('#resetBtn').on('click', function(){
	var userid = localStorage.getItem('userid');
	var URL = '/reset/'
	$.get('/reset/' + userid, function(data){
		console.log(data);
	});
});

//Slider to set color variance
$("#slider").on("mouseup", function() { 
	var sliderNum = $('#slider').val();
	var currentURL = window.location.origin;
	var URL = currentURL + '/setvariance/' + userid + '/' + sliderNum;

	$.get(URL);
});


function getLoggedUserColors(userid){
	var currentLocation = window.location.origin;
	var URL = currentLocation + '/userRGB/' + userid;
	$.get(URL, function(data){
		// callback(data);
		var red = data.red;
		var green = data.green;
		var blue = data.blue;

		console.log(red);
		console.log(green);
		console.log(blue);
		$('.color-window').css('background-color', `rgb(${red}, ${green}, ${blue})`);
	});
}