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
