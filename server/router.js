var express = require('express');
var passport = require('passport');
var AuthCtrl = require(__base + 'controllers/userAuth');
var DeviceAuthCtrl = require(__base + 'controllers/device/deviceAuth');
var DeviceCrudCtrl = require(__base + 'controllers/device/deviceCrud');
var LanguageCrudCtrl = require(__base + 'controllers/language/languageCrud');
var TourCrudCtrl = require(__base + 'controllers/tour/tourCrud');
var WaypointsCrudCtrl = require(__base + 'controllers/waypoints/waypointCrud');

var TourAppCtrl = require(__base + 'controllers/tour/tourApp');
var WaypointsAppCtrl = require(__base + 'controllers/waypoints/waypointApp');
var LanguageAppCtrl = require(__base + 'controllers/language/languageApp');

var passportService = require(__base + 'config/passport');

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
        toursRoutes = express.Router(),
        waypointsRouter = express.Router();

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

    waypointsRouter.post('/tours/:tourId/waypoints', requireUserAuth, WaypointsCrudCtrl.create);
    waypointsRouter.post('/tours/:tourId/waypoints/:id/files', requireUserAuth, WaypointsCrudCtrl.createFiles);
    waypointsRouter.get('/tours/:tourId/waypoints', requireUserAuth, WaypointsCrudCtrl.getAll);
    waypointsRouter.get('/tours/:tourId/waypoints/:id', requireUserAuth, WaypointsCrudCtrl.get);
    waypointsRouter.put('/tours/:tourId/waypoints/:id', requireUserAuth, WaypointsCrudCtrl.update);
    waypointsRouter.delete('/tours/:tourId/waypoints/:id', requireUserAuth, WaypointsCrudCtrl.delete);

    adminRoutes.use('/', waypointsRouter);

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
        appLanguagesRoutes = express.Router(),
        appWaypointsRoutes = express.Router();

    /*** mobile-app ***/

    //app-auth
    appAuthRoutes.post('/signin', DeviceAuthCtrl.login);
    apiRoutes.use('/', appAuthRoutes);

    //app-active-langs
    appLanguagesRoutes.get('/languages/active', requireDeviceAuth, LanguageAppCtrl.getActives);
    apiRoutes.use('/', appLanguagesRoutes);

    //app-tours
    appToursRoutes.get('/tours', requireDeviceAuth, TourAppCtrl.getAll);
    appToursRoutes.get('/tours/:id', requireDeviceAuth, TourAppCtrl.get);
    apiRoutes.use('/', appToursRoutes);

    //app-waypoints
    appWaypointsRoutes.get('/tours/:tourId/waypoints', requireDeviceAuth, WaypointsAppCtrl.getAll);
    appWaypointsRoutes.get('/tours/:tourId/waypoints/:id', requireDeviceAuth, WaypointsAppCtrl.get);
    apiRoutes.use('/', appWaypointsRoutes);

    app.use('/api', apiRoutes);
};
