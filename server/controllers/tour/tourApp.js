var Tour = require(__base + 'models/tour'),
    config = require(__base + 'config/main');

exports.getAll = function(req, res) {
    Tour.find({
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
