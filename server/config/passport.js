// Importing Passport, strategies, and config
var passport = require('passport'),  
  	User = require('../models/user'),
  	config = require('./main'),
  	JwtStrategy = require('passport-jwt').Strategy,
  	ExtractJwt = require('passport-jwt').ExtractJwt,
  	LocalStrategy = require('passport-local');

var localOptions = { usernameField: 'email' };  

// Setting up local login strategy
var localLogin = new LocalStrategy(localOptions, function(email, password, done) {  
  User.findOne({ email: email }, function(err, user) {
    if(err) { return done(err); }
    if(!user) { 
      return done('Your login details could not be verified. Please try again.');
      //return done(null, false, { success: false, error: 'Your login details could not be verified. Please try again.' }); 
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { 
        return done('Your login details could not be verified. Please try again.');
        //return done(null, false, { success: false, error: "Your login details could not be verified. Please try again." }); 
      }

      return done(null, user);
    });
  });
});

var jwtOptions = {  
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: config.secret
};

// Setting up JWT login strategy
var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {  
  User.findById(payload._id, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);