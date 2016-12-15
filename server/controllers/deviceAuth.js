var jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
  	Device = require('../models/device'),
  	config = require('../config/main'),
    setUserInfo = require('../helpers').setUserInfo,
    passport = require('passport');

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
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.json( { success: false, error: info.error })
    }

    var userInfo = setUserInfo(user);

    res.status(200).json({
      success: true,
      token: `JWT ${generateToken(userInfo)}`,
      user: userInfo
    });
  })(req, res, next);
};


//= =======================================
// Registration Route
//= =======================================
exports.add = function (req, res, next) {
  // Check for registration errors
  var accountId = req.body.accountId;
  var name = req.body.name;
  var authCode = req.body.authCode;

  if (!accountId) {
    return res.status(422).send({ error: 'AccountId wrong or empty.' });
  }

  // Return error if no email provided
  if (!name) {
    return res.status(422).send({ error: 'You must enter an name of device.' });
  }

  // Return error if no password provided
  if (!authCode) {
    return res.status(422).send({ error: 'You must enter a authCode.' });
  }

  Device.findOne({ authCode }, (err, existingAuthCode) => {
    if (err) { return next(err); }

      // If user is not unique, return error
    if (existingAuthCode) {
      return res.status(422).send({ error: 'That authCode is already in use.' });
    }

      // If email is unique and password was provided, create account
    var device = new Device({
      accountId,
      name,
      authCode
    });

    device.save((err, device) => {
      if (err) { return next(err); }

        // Subscribe member to Mailchimp list
        // mailchimp.subscribeToNewsletter(user.email);

        // Respond with JWT if user was created

      //var userInfo = setUserInfo(user);

      res.status(201).json({
        success: true,
        //token: `JWT ${generateToken(userInfo)}`,
        //user: userInfo
      });
    });
  });
};
