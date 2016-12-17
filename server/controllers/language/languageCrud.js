var Language = require('../../models/language');

exports.getAll = function(req, res) {
	Language.find(function(err, languages) {
		if (err) {
			return res.send(err);
		}

	  	res.json({
			success: true,
			data: languages
		});
	});
};

exports.get = function(req, res) {
    Language.findOne({
        _id: req.params.id
    }, function(err, language) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: language
        });
    });
};

exports.update = function(req, res) {
    Language.findOne({
        _id: req.params.id
    }, function(err, language) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body) {
            language[prop] = req.body[prop];
        }

        language.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.json({
                success: true,
                data: language
            });
        });
    });
};

exports.delete = function(req, res) {
    Language.remove({
        _id: req.params.id
    }, function(err, language) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: language
        });
    });
}
