var jwt = require('jsonwebtoken'),
    Tour = require('../../models/tour'),
    config = require('../../config/main');

exports.create = function(req, res, next) {

    var accountId = req.body.accountId;
    var name = req.body.name;
    var orderBy = req.body.orderBy || 0;

    if (!accountId) {
        return res.status(422).send({
            error: 'AccountId wrong or empty.'
        });
    }

    if (!name) {
        return res.status(422).send({
            error: 'You must enter an name of tour.'
        });
    }

	console.log(req.body);

	var tour = new Tour(req.body);

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
        accountId: req.query.sid
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
        accountId: req.query.sid
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


exports.update = function(req, res) {
    Tour.findOne({
        _id: req.params.id,
        accountId: req.query.sid
    }, function(err, tour) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body) {
            tour[prop] = req.body[prop];
        }

        // save the tour
        device.save(function(err) {
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

exports.delete = function(req, res) {
    Tour.remove({
        _id: req.params.id,
        accountId: req.query.sid
    }, function(err, tour) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: tour
        });
    });
}
