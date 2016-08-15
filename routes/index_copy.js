var express = require('express');
var router = express.Router();


/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'ServerSide Fostering Linux Training Mgmt System' });
});*/

console.log('in app controller index js');
// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
console.log('in app.controller use function');
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
    }

    next();
});

// make JWT token available to angular app
router.get('/token', function (req, res) {
console.log('in app.controller get function');
    res.send(req.session.token);
});

// serve angular app files from the '/app' route
router.use('/', express.static('app'));

var mongoose = require('mongoose');
// var mongoosastic = require('mongoosastic');

var InquiryModel = require('../models/InquiryBody.js');


router.get('/getinquiries', function(req, res, next) {
 console.log('entered router get function for /getinquiries');
 // find is run thru model defined in mongoose.model
  InquiryModel.find(function(err, InquiryModel){
    if(err){
	    console.log ('i am here in error')
	    return next(err); }
    console.log('success');
    console.log(InquiryModel);
    res.json(InquiryModel);
  });
});


/* POST request */
router.post('/submitInquiry', function(req, res, next) {
	/* creating a new  object before saving in database */
console.log('entered router post function at /submitInquiry');
console.log(req.body);

  InquiryModel.create(req.body,function(err,post){
    if(err) return next(err);
    console.log('data being posted in db='+post);
    res.json(post);
  });
});

/* POST request */
router.post('/register', function(req, res, next) {
  /* creating a new  object before saving in database */
console.log('entered router post function at /register');
console.log(req.body);

});

module.exports = router;
