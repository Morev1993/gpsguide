var express = require('express');
var passport = require('passport');
var AuthCtrl = require('./controllers/userAuth');
var DeviceAuthCtrl = require('./controllers/device/deviceAuth');
var DeviceCrudCtrl = require('./controllers/device/deviceCrud');
var LanguageCrudCtrl = require('./controllers/language/languageCrud');
var TourCrudCtrl = require('./controllers/tour/tourCrud');

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
    var adminRoutes = express.Router(),
        authRoutes = express.Router(),
        devicesRoutes = express.Router(),
        languagesRoutes = express.Router(),
        toursRoutes = express.Router();

    /*** admin-webapp ***/

    //user auth routes
    authRoutes.post('/signup', AuthCtrl.register);
    authRoutes.post('/signin', AuthCtrl.login);
    authRoutes.get('/user', requireUserAuth, AuthCtrl.getUserInfo);

    adminRoutes.use('/', authRoutes);

    //Device routes
    devicesRoutes.post('/devices', requireUserAuth, DeviceCrudCtrl.create);
    devicesRoutes.get('/devices', requireUserAuth, DeviceCrudCtrl.getAll);
    devicesRoutes.get('/devices/:id', requireUserAuth, DeviceCrudCtrl.get);
    devicesRoutes.put('/devices/:id', requireUserAuth, DeviceCrudCtrl.update);
    devicesRoutes.delete('/devices/:id', requireUserAuth, DeviceCrudCtrl.delete);

    adminRoutes.use('/', devicesRoutes);

    //Language routes
    languagesRoutes.get('/languages', requireUserAuth, LanguageCrudCtrl.getAll);
    languagesRoutes.get('/languages/active', requireUserAuth, LanguageCrudCtrl.getActives);
    languagesRoutes.get('/languages/:id', requireUserAuth, LanguageCrudCtrl.get);
    languagesRoutes.put('/languages/:id', requireUserAuth, LanguageCrudCtrl.update);
    languagesRoutes.delete('/languages/:id', requireUserAuth, LanguageCrudCtrl.delete);

    adminRoutes.use('/', languagesRoutes);


    //Language routes
    toursRoutes.post('/tours', requireUserAuth, TourCrudCtrl.create);
    toursRoutes.get('/tours', requireUserAuth, TourCrudCtrl.getAll);
    toursRoutes.get('/tours/:id', requireUserAuth, TourCrudCtrl.get);
    toursRoutes.put('/tours/:id', requireUserAuth, TourCrudCtrl.update);
    toursRoutes.delete('/tours/:id', requireUserAuth, TourCrudCtrl.delete);

    adminRoutes.use('/', toursRoutes);

    // Test protected route
    adminRoutes.get('/protected', requireUserAuth, (req, res) => {
        res.send({
            content: 'The protected test route is functional!'
        });
    });

    app.use('/api/admin', adminRoutes);

    //--------------------------------------//

    var apiRoutes = express.Router(),
        appAuthRoutes = express.Router(),
        appToursRoutes = express.Router(),
        appLanguagesRoutes = express.Router();

    /*** mobile-app ***/

    //app-auth
    appAuthRoutes.post('/signin', DeviceAuthCtrl.login);
    apiRoutes.use('/', appAuthRoutes);

    //app-active-langs
    appLanguagesRoutes.get('/languages/active', requireDeviceAuth, LanguageCrudCtrl.getActives);
    apiRoutes.use('/', appLanguagesRoutes);

    //app-tours
    appToursRoutes.get('/tours', requireDeviceAuth, TourCrudCtrl.getAll);
    appToursRoutes.get('/tours/:id', requireDeviceAuth, TourCrudCtrl.get);
    apiRoutes.use('/', appToursRoutes);

    app.use('/api', apiRoutes);
};
