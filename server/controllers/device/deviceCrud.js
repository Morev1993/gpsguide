var jwt = require('jsonwebtoken'),
    Device = require('../../models/device'),
    config = require('../../config/main'),
    setDeviceInfo = require('../../helpers').setDeviceInfo,
    passport = require('passport');

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(data) {
    return jwt.sign(data, config.secret, {
        expiresIn: 10080 // in seconds
    });
}

exports.create = function(req, res, next) { 
    var accountId = req.user._id;
    var name = req.body.name;
    var authCode = req.body.authCode;
    var orderBy = req.body.orderBy || 0;

    // Return error if no email provided
    if (!name) {
        return res.status(422).send({
            error: 'You must enter an name of device.'
        });
    }

    // Return error if no password provided
    if (!authCode) {
        return res.status(422).send({
            error: 'You must enter an auth code.'
        });
    }

    if (authCode.length !== 5) {
        return res.status(422).send({
            error: 'Auth code must have five numbers.'
        });
    }

    Device.findOne({
        authCode
    }, (err, existingAuthCode) => {
        if (err) {
            return next(err);
        }

        // If user is not unique, return error
        if (existingAuthCode) {
            return res.status(422).send({
                error: 'That auth code is already in use.'
            });
        }

        // If email is unique and password was provided, create account
        var device = new Device({
            accountId,
            name,
            authCode,
            orderBy
        });

        device.save((err, device) => {
            if (err) {
                return next(err);
            }

            var deviceInfo = setDeviceInfo(device);

            res.status(201).json({
                success: true,
                token: `JWT ${generateToken(deviceInfo)}`,
                data: device
            });
        });
    });

};

exports.getAll = function(req, res) {
    Device.find({
        accountId: req.user._id
    }, function(err, devices) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: devices
        });
    });
};

exports.get = function(req, res) {
    Device.findOne({
        _id: req.params.id,
        accountId: req.user._id
    }, function(err, device) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: device
        });
    });
};


exports.update = function(req, res) {
    Device.findOne({
        _id: req.params.id,
        accountId: req.user._id
    }, function(err, device) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body) {
            device[prop] = req.body[prop];
        }

        // save the movie
        device.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.json({
                success: true,
                data: device
            });
        });
    });
};

exports.delete = function(req, res) {
    Device.remove({
        _id: req.params.id,
        accountId: req.user._id
    }, function(err, device) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: device
        });
    });
}
