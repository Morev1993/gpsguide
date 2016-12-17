var jwt = require('jsonwebtoken'),
    Device = require('../../models/device'),
    config = require('../../config/main'),
    setDeviceInfo = require('../../helpers').setDeviceInfo;

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

    if (!authCode) {
        return res.status(422).send({
            error: 'Auth code is empty.'
        });
    }

    // Return error if no email provided
    if (!model) {
        return res.status(422).send({
            error: 'Model is empty.'
        });
    }

    // Return error if no password provided
    if (!authCode) {
        return res.status(422).send({
            error: 'You must enter a authCode.'
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
                error: 'That authCode gone.'
            });
        }

        device.device = model;
        device.version = version;
        device.status = status || 'unactive';

        device.save((err, device) => {
            if (err) {
                return next(err);
            }

            // Subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);

            // Respond with JWT if user was created

            var deviceInfo = setDeviceInfo(device);

            res.status(201).json({
                success: true,
                token: `JWT ${generateToken(deviceInfo)}`,
                data: deviceInfo
            });
        });
    });

};
