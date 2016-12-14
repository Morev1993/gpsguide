var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./models/user'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);


// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
	if (!req.body.name || !req.body.password) {
		res.json({success: false, msg: 'Please pass name and password.'});
	} else {
	var newUser = new User({
		name: req.body.name,
      	password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      	if (err) {
        	return res.json({success: false, msg: 'Username already exists.'});
      	}
      		res.json({success: true, msg: 'Successful created new user.'});
    	});
  	}
});

// connect the api routes under /api/*
app.use('/api', apiRoutes);