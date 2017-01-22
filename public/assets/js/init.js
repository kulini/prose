(function($){
  $(function(){

    $('.button-collapse').sideNav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

$('.addsentencesubmit').on('click', function() {

			var userinput = $('.mytext').val();
      console.log( "ready!" );

      var dbs = {
      	// 'local': 'http://localhost:3000/',
      	'local': 'https://crossorigin.me/http://localhost:3000',
      	'remote': 'heroku',
      }
      // Setup your axios with the base url of the API and headers for json support.
      // You'll only need this crossorigin proxy if you haven't enabled (CORS) https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
      var prosePros = axios.create({
        baseURL: dbs.local,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
      });


      prosePros.post('/addsentence',{
      	userid: 'han',
      	sentence: userinput
      })
        .then(function (res) {
          console.log(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    });