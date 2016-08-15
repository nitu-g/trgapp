var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
console.log('in forgotpassword.controller get fucntion');
delete req.session.token;

    // move success message into local variable so it only appears once (single read)
    var viewData = { success: req.session.success };
    delete req.session.success;

    res.render('forgotpassword', viewData);


});

router.post('/', function (req, res) {
console.log('in forgot.controller post fucntion');
req.checkBody("username", "Enter a valid email address.").isEmail();
var errors = req.validationErrors();
if (errors) {
console.log("in if after validationErrors");
            return res.render('forgotpassword', { error: errors, 
                username: req.body.username });
  } else {
	console.log("in else");
    	// register using api to maintain clean separation between layers
    	request.post({
        	url: config.apiUrl + '/users/forgotpassword',
        	form: req.body,
        	json: true
    		},
	function (userexist, response, body) {
        if (userexist) {
    console.log("in if userexist");
            return res.render('forgotpassword', { userexist: 'An error occurred' });
        };

	var manish = 'testing mail';
        if (response.statusCode !== 200) {
            console.log("in if !== 200 ");
            return res.render('forgotpassword', {
                userexist: response.body,
                username: req.body.username
// call function which we want to display
          });
	
        }

        // return to login page with success message
        //req.session.success = 'Password reset link sent successfully';

        return res.redirect('/login');

    });
}
});

module.exports = router;
