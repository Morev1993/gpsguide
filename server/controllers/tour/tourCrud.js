var Tour = require(__base + 'models/tour'),
    deleteFolderRecursive = require(__base + 'helpers'),
    Waypoint = require(__base + 'models/waypoint'),
    AudioFile = require(__base + 'models/audiofile'),
    deleteFolderRecursive = require(__base + 'helpers').deleteFolderRecursive,
    TourDevice = require(__base + 'models/TourDevice');

exports.create = function(req, res, next) {
    var accountId = req.user._id;
    var name = req.body.name;
    var orderBy = req.body.orderBy || 0;

    if (!name) {
        return res.status(422).send({
            error: 'You must enter an name of tour.'
        });
    }

	var tour = new Tour({
        accountId,
        name,
        orderBy
    });

	tour.save((err, tour) => {
		if (err) {
			return next(err);
		}

		res.status(201).json({
			success: true,
			data: tour
		});
	});
};

exports.getAll = function(req, res) {
    Tour.find({
        accountId: req.user._id
    }, function(err, tours) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: tours
        });
    });
};

exports.get = function(req, res) {
    Tour.findOne({
        _id: req.params.id,
        accountId: req.user._id
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

exports.getToursId = function(req, res) {
    console.log(req);
    TourDevice.find({
        accountId: req.user.accountId
    }, function(err, tours) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: tours
        });
    });
};


exports.update = function(req, res) {
    Tour.findOne({
        _id: req.params.id,
        accountId: req.user._id
    }, function(err, tour) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body) {
            tour[prop] = req.body[prop];
        }

        // save the tour
        tour.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.json({
                success: true,
                data: tour
            });
        });
    });
};

exports.delete = function(req, res, next) {
    var waysIds = [];
    Tour.remove({
        _id: req.params.id,
        accountId: req.user._id
    }).then(result => {
        return Waypoint.remove({
            tourId: req.params.id
        })
    }).then(result => {
        return AudioFile.find({
            tourId: req.params.id
        })
    }).then(files => {
        files.forEach(file => {
            waysIds.push(file.waypointId);
        })
        return AudioFile.remove({
            tourId: req.params.id
        })
    }).then(result => {
        waysIds.forEach(id => {
            var folder = `${global.__base}public/${id}`;
            deleteFolderRecursive(folder);
        })
        res.json({
            success: true,
            data: {
                result: result,
                _id: req.params.id
            }
        });
    }).catch(err => {
        return next(err);
    })
}
