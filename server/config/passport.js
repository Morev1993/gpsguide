// Importing Passport, strategies, and config
var passport = require('passport'),
    User = require('../models/user'),
    Device = require('../models/device'),
    config = require('./main'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    LocalStrategy = require('passport-local');

var userOptions = {
    usernameField: 'email'
};

// Setting up local login strategy
var userLogin = new LocalStrategy(userOptions, function(email, password, done) {
    User.findOne({
        email: email
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                error: 'Your login details could not be verified. Please try again.'
            });
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false, {
                    error: "Your login details could not be verified. Please try again."
                });
            }

            return done(null, user);
        });
    });
});

var deviceOptions = {
    passwordField: 'code'
};

// Setting up local login strategy
var deviceLogin = new LocalStrategy(deviceOptions, function(model, authCode, done) {
    Device.findOne({
        authCode: authCode
    }, function(err, device) {
        console.log(device);
        if (err) {
            return done(err);
        }
        if (!device) {
            return done(null, false, {
                error: 'Your device login details could not be verified.'
            });
        }

        /*user.comparePassword(password, function(err, isMatch) {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, { error: "Your login details could not be verified. Please try again." });
          }

          return done(null, user);
        });*/
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
        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
//passport.use(localLogin);

passport.use('user', userLogin);
//passport.use('device', deviceLogin);
