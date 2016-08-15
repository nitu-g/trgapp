require('rootpath')();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var validator = require('express-validator');
var expressJwt = require('express-jwt');
var config = require('config.json');
var router = express.Router();

console.log("Server start from __dirname %s...", __dirname);

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register', '/api/users/forgotpassword'] }));

//var routes = require('./routes/index');
//var users = require('./routes/users');

//app.use('/', routes);
//app.use('/users', users);

// routes
//app.use('/', require('./routes/login.controller'));
app.use('/login', require('./routes/login.controller'));
app.use('/register', require('./routes/register.controller'));
app.use('/forgotpassword', require('./routes/forgotpassword.controller'));
//app.use('/app', require('./routes/app.controller'));
app.use('/app', require('./routes/index'));
app.use('/api/users', require('./routes/api/users.controller'));


// make '/app' default route
app.get('/', function (req, res) {
   console.log('route to default path');
   return res.redirect('/app');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("error block");
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

var mongoose = require('mongoose');
// var mongoosastic = require('mongoosastic'); -> related to elastic search

//require('./models/User');
var autoIncrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://localhost:27017/trgs',function(err)
          {if (err) {console.log('connection error',err);} else
      { console.log('connection successful');}});

var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
})