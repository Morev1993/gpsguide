var jwt = require('jsonwebtoken'),
    Waypoint = require(__base + 'models/waypoint'),
    config = require(__base + 'config/main');

exports.create = function(req, res, next) {
	var tourId = req.params.tourId;
    var name = req.body.name;
	var lat = req.body.lat;
	var lon = req.body.lon;
	var tolerance = req.body.tolerance;
	var delay = req.body.delay;
	var overlap = req.body.overlap;
	var radius = req.body.radius;
    var orderBy = req.body.orderBy || 0;

    if (!name) {
        return res.status(422).send({
            error: 'You must enter an name of tour.'
        });
    }

	if (!tourId) {
        return res.status(422).send({
            error: 'TourId is empty.'
        });
    }

	if (!tourId) {
        return res.status(422).send({
            error: 'TourId is empty.'
        });
    }

	if (!lat || !lon) {
        return res.status(422).send({
            error: 'Coords is empty.'
        });
    }

	var waypoint = new Waypoint({
		tourId,
        name,
		lat,
		lon,
		tolerance,
		delay,
		overlap,
		radius,
        orderBy
    });

	waypoint.save((err, tour) => {
		if (err) {
			return next(err);
		}

		res.status(201).json({
			success: true,
			data: waypoint
		});
	});
};

exports.getAll = function(req, res) {
    Waypoint.find({
        tourId: req.params.tourId
    }, function(err, waypoint) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: waypoint
        });
    });
};

exports.get = function(req, res) {
    Waypoint.findOne({
        _id: req.params.id,
        tourId: req.params.tourId
    }, function(err, waypoint) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: waypoint
        });
    });
};


exports.update = function(req, res) {
	Waypoint.findOne({
		_id: req.params.id,
        tourId: req.params.tourId
    }, function(err, waypoint) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body) {
            waypoint[prop] = req.body[prop];
        }

        // save the tour
        waypoint.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.json({
                success: true,
                data: waypoint
            });
        });
    });
};

exports.delete = function(req, res) {
    Waypoint.remove({
		_id: req.params.id,
        tourId: req.params.tourId
    }, function(err, waypoint) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: waypoint
        });
    });
}
