var jwt = require('jsonwebtoken'),  
    crypto = require('crypto'),
  	User = require('../models/user'),
  	config = require('../config/main'),
	setUserInfo = require('../helpers').setUserInfo;

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: 10080 // in seconds
	});
}

//= =======================================
// Login Route
//= =======================================
exports.login = function (req, res, next) {
  var userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
};


//= =======================================
// Registration Route
//= =======================================
exports.register = function (req, res, next) {
  // Check for registration errors
  var email = req.body.email;
  var password = req.body.password;

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.' });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) { return next(err); }

      // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'That email address is already in use.' });
    }

      // If email is unique and password was provided, create account
    var user = new User({
      email,
      password
    });

    user.save((err, user) => {
      if (err) { return next(err); }

        // Subscribe member to Mailchimp list
        // mailchimp.subscribeToNewsletter(user.email);

        // Respond with JWT if user was created

      var userInfo = setUserInfo(user);

      res.status(201).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
      });
    });
  });
};