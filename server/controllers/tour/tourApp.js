var Tour = require(__base + 'models/tour');
var TourDevice = require(__base + 'models/tourDevice');
var mongoose = require('mongoose');

exports.getAll = function(req, res, next) {
    var disabledToursId = [];

    TourDevice.find({
        deviceId: req.user._id
    }).then((tours) => {
        tours.forEach(tour => {
            disabledToursId.push(mongoose.Types.ObjectId((tour.tourId)))
        });

        return Tour.find({
            accountId: req.user.accountId,
            _id: { $nin: disabledToursId }
        });
    }).then(tours => {
        res.json({
            success: true,
            data: tours
        });
	}).catch(err => {
		return next(err);
	})
};

exports.get = function(req, res) {
    Tour.findOne({
        _id: req.params.id,
        accountId: req.user.accountId
    }, function(err, tour) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: tour
        });
    });
};
