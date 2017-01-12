global.__base = __dirname + '/';

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    config = require(__base + 'config/config'),
    router = require(__base + 'router'),
    path = require('path');

mongoose.Promise = global.Promise;

// Database Setup
mongoose.connect(config.database);

// Start the server
const server = app.listen(config.port);
console.log('Your server is running on port ' + config.port + '.');

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use('/public', express.static(path.join(global.__base, 'public')));
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
});

// Import routes to be served
router(app);

// necessary for testing
module.exports = server;
