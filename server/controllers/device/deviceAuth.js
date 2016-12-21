var jwt = require('jsonwebtoken'),
    Device = require('models/device'),
    config = require('config/main'),
    setDeviceInfo = require('helpers').setDeviceInfo;

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(data) {
    return jwt.sign(data, config.secret, {
        expiresIn: 10080 // in seconds
    });
}

//= =======================================
// Login Route
//= =======================================
exports.login = function(req, res, next) {
    var authCode = req.body.code;
    var model = req.body.model;
    var version = req.body.sdk_int;
    var status = req.body.status;

    // Return error if no email provided
    /*if (!model) {
        return res.status(422).send({
            error: 'Model is empty.'
        });
    }*/

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
    }, (err, device) => {
        if (err) {
            return next(err);
        }

        // If user is not unique, return error
        if (!device) {
            return res.status(422).send({
                error: 'Auth code is not correct.'
            });
        }

        device.device = model || device.device;
        device.version = version || device.version;
        device.status = true;

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
