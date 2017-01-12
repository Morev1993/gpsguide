var jwt = require('jsonwebtoken'),
    Device = require(__base + 'models/device'),
    config = require(__base + 'config/main'),
    setDeviceInfo = require(__base + 'helpers').setDeviceInfo;

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
    var deviceId = req.body.deviceId;

    var deviceIdOut = false;

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

    Device.findOne({
        authCode,
        deviceId
    }).then(device => {
    	if (device) {
    		console.log('device id and auth code is right');
    		var deviceInfo = setDeviceInfo(device);

    		res.status(201).json({
	            success: true,
	            token: `JWT ${generateToken(deviceInfo)}`,
	            data: device
	        });
	        
	        return Promise.reject();
    	} else {
    		// device with device_id is gone and we should find by authcode
    		return Device.findOne({ authCode });
    	}
    }).then(device => {
    	if (!device) {
			res.status(422).send({
	            error: 'Wrong auth code.'
	        });

	        return Promise.reject();
    	} else if (device) {
    		if (!device.deviceId) {
				device.device = model || device.device;
		        device.version = version || device.version;
		        device.status = true;
		        device.deviceId = deviceId;

		        return device.save();
    		} else {
				res.status(422).send({
		            error: 'Wrong device id.'
		        });

		        return Promise.reject();
    		}
    	}
	}).then(device => {
		var deviceInfo = setDeviceInfo(device);

        res.status(201).json({
            success: true,
            token: `JWT ${generateToken(deviceInfo)}`,
            data: device
        });
	}).catch(err => {
		return next(err);
	})

};
