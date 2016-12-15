var express = require('express');
var passport = require('passport');
var AuthCtrl = require('./controllers/userAuth');
var DeviceAuthCtrl = require('./controllers/deviceAuth');

var passportService = require('./config/passport');

// Middleware to require login/auth
var requireAuth = passport.authenticate('jwt', { session: false });
var requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app) {
  // Initializing route groups
  var apiRoutes = express.Router(),
	authRoutes = express.Router();

  //= ========================
  // Auth Routes
  //= ========================
  // Registration route
  authRoutes.post('/user/signup', AuthCtrl.register);

  // Login route
  authRoutes.post('/user/signin', AuthCtrl.login);

  //for device
  authRoutes.post('/signin', DeviceAuthCtrl.login);
  authRoutes.post('/add', DeviceAuthCtrl.add);

  apiRoutes.use('/', authRoutes);



  //= ========================
  // User Routes
  //= ========================

  // Test protected route
  apiRoutes.get('/protected', requireAuth, (req, res) => {
	 res.send({ content: 'The protected test route is functional!' });
  });

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
