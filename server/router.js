var express = require('express');
var passport = require('passport');
var AuthCtrl = require('./controllers/userAuth');
var DeviceAuthCtrl = require('./controllers/device/deviceAuth');
var DeviceCrudCtrl = require('./controllers/device/deviceCrud');
var LanguageCrudCtrl = require('./controllers/language/languageCrud');

var passportService = require('./config/passport');

// Middleware to require login/auth
var requireUserAuth = passport.authenticate('user-auth', {
    session: false
});

var requireDeviceAuth = passport.authenticate('device-auth', {
    session: false
});

var requireLogin = passport.authenticate('local', {
    session: false
});

module.exports = function(app) {
    // Initializing route groups
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        devicesRoutes = express.Router(),
        languagesRoutes = express.Router();

    //user auth routes
    authRoutes.post('/user/signup', AuthCtrl.register);
    authRoutes.post('/user/signin', AuthCtrl.login);

    apiRoutes.use('/', authRoutes);

    //Device routes
    devicesRoutes.post('/signin', DeviceAuthCtrl.login);
    devicesRoutes.post('/devices', requireUserAuth, DeviceCrudCtrl.create);
    devicesRoutes.get('/devices', requireUserAuth, DeviceCrudCtrl.getAll);
    devicesRoutes.get('/devices/:id', requireUserAuth, DeviceCrudCtrl.get);
    devicesRoutes.put('/devices/:id', requireUserAuth, DeviceCrudCtrl.update);
    devicesRoutes.delete('/devices/:id', requireUserAuth, DeviceCrudCtrl.delete);

    apiRoutes.use('/', devicesRoutes);

    //Language routes
    languagesRoutes.get('/languages', requireUserAuth, LanguageCrudCtrl.getAll);
    languagesRoutes.get('/languages/active', requireDeviceAuth, LanguageCrudCtrl.getActives);
    languagesRoutes.get('/languages/:id', requireDeviceAuth, LanguageCrudCtrl.get);
    languagesRoutes.put('/languages/:id', requireUserAuth, LanguageCrudCtrl.update);
    languagesRoutes.delete('/languages/:id', requireUserAuth, LanguageCrudCtrl.delete);

    apiRoutes.use('/', languagesRoutes);

    // Test protected route
    apiRoutes.get('/protected', requireUserAuth, (req, res) => {
        res.send({
            content: 'The protected test route is functional!'
        });
    });

    // Set url for API group routes
    app.use('/api', apiRoutes);
};
