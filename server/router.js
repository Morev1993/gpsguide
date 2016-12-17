var express = require('express');
var passport = require('passport');
var AuthCtrl = require('./controllers/userAuth');
var DeviceAuthCtrl = require('./controllers/device/deviceAuth');
var DeviceCrudCtrl = require('./controllers/device/deviceCrud');
var LanguageCrudCtrl = require('./controllers/language/languageCrud');

var passportService = require('./config/passport');

// Middleware to require login/auth
var requireAuth = passport.authenticate('jwt', {
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
    devicesRoutes.post('/devices', requireAuth, DeviceCrudCtrl.create);
    devicesRoutes.get('/devices', requireAuth, DeviceCrudCtrl.getAll);
    devicesRoutes.get('/devices/:id', requireAuth, DeviceCrudCtrl.get);
    devicesRoutes.put('/devices/:id', requireAuth, DeviceCrudCtrl.update);
    devicesRoutes.delete('/devices/:id', requireAuth, DeviceCrudCtrl.delete);

    apiRoutes.use('/', devicesRoutes);

    //Language routes
    languagesRoutes.get('/languages', LanguageCrudCtrl.getAll);
    languagesRoutes.get('/languages/:id', LanguageCrudCtrl.get);
    languagesRoutes.put('/languages/:id', LanguageCrudCtrl.update);
    languagesRoutes.delete('/languages/:id', LanguageCrudCtrl.delete);

    apiRoutes.use('/', languagesRoutes);

    // Test protected route
    apiRoutes.get('/protected', requireAuth, (req, res) => {
        res.send({
            content: 'The protected test route is functional!'
        });
    });

    // Set url for API group routes
    app.use('/api', apiRoutes);
};
