var jwt = require('jsonwebtoken'),
    Device = require(__base + 'models/device'),
    config = require(__base + 'config/config'),
    setDeviceInfo = require(__base + 'helpers').setDeviceInfo,
    co = require('co');

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(data) {
    return jwt.sign(data, config.secret, {
        expiresIn: 100000000000000000
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
    var deviceId = req.body.deviceId;

    var deviceIdOut = false;

    // return error if no password provided
    if (!authCode) {
        return res.status(422).send({
            error: 'You must enter an auth code.'
        });
    }

    if (!deviceId) {
        return res.status(422).send({
            error: 'You must enter device id.'
        });
    }

    if (authCode.length !== 5) {
        return res.status(422).send({
            error: 'Auth code must have five numbers.'
        });
    }

    co(function *() {
        var newDevice = yield* addNewDevice(res, authCode, model, version, deviceId);

        if (newDevice) {
            var deviceInfo = setDeviceInfo(newDevice);

            res.status(201).json({
                success: true,
                token: `JWT ${generateToken(deviceInfo)}`,
                data: newDevice
            });
        }

        return;

    }).catch(err => {
        console.log(err);
    });

};

function* addNewDevice(res, authCode, model, version, deviceId) {
    var device = yield Device.findOne({ authCode });

    if (!device) {
        res.status(422).send({
            error: 'Wrong auth code.'
        });
        return;
    }

    if (device && !device.deviceId) {
        var deviceWithCurrentId = yield Device.findOne({ deviceId });

        if (deviceWithCurrentId) {
            res.status(422).send({
                error: 'That device id is already in use.'
            });
            return;
        }

        device.device = model || device.device;
        device.version = version || device.version;
        device.status = true;
        device.deviceId = deviceId;

        return yield device.save();
    }

    if (device.deviceId === deviceId) {
        return device;
    } else {
        res.status(422).send({
            error: 'Wrong device id.'
        });
    }

    return;
}
