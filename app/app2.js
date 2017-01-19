//LOG IN FUNCTION
var loggedIn = false;
var userID;

//Determines the range of colors in a photo. Used in getImages()/nextImage route on server
var variance;

if (!loggedIn) variance = 25;

//color profile for users who aren't logged in. RGB values
var unloggedRGB = [130, 130, 130];

//when the user successfully logs in, 'loggedIn' toggles to true
$('#submitBtn').on('click', function(){
	//values from log in modal window
	var useremail = $('#email').val();
	var userpassword = $('#password').val();
	var currentLocation = window.location.origin;

	//make ajax call to mysql db. if login details match, 'loggedIn' is toggled to true
	$.get(currentLocation + "/members", function(data){
    	for (var i = 0; i < data.length; i++){
    		if (data[i].email === useremail && data[i].password === userpassword){
    			loggedIn = true;
    			console.log(loggedIn);
    			// console.log(data[i].username);
    			userID = data[i].username;
    			console.log(userID);
    			localStorage.setItem('userid', userID);
    			var userid = localStorage.getItem('userid');
    		}
    	}
		queryVariance(userID);
	});
	
	$('#email').val('');
	$('#password').val('');
	return false;
});	


//Function to place an AJAX call for user's color variance value
function queryVariance(userid){
	var currentLocation = window.location.origin;
	var URL = currentLocation + '/variance/' + userid;
	$.get(URL, function(data){
		variance = data;
		// console.log('variance: ' + variance);
		localStorage.setItem('userVariance', variance);
	});
}


//REGISTER FUNCTION
$('#registerBtn').on('click', function(){

	var username = $('#icon_prefix').val();
	var email = $('#icon_email').val();
	var password = $('#icon_password').val();

	var userInfo = {
		username: username,
		email: email,
		password: password
	};
	// console.log(userInfo);

	//current URL displayed in the browser, e.g. localhost:3000
	var currentLocation = window.location.origin;

	if (username && email && password){
		$.post(currentLocation + '/adduser', userInfo, function(data){
			console.log(status);
			$('#icon_prefix').val();
			$('#icon_email').val();
			$('#icon_password').val();
		});
	}
});

