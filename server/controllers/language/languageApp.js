var Language = require(__base + 'models/language');

exports.getActives = function(req, res) {
	Language.find({
        accountId: req.user.accountId,
		status: true
    }, function(err, languages) {
		if (err) {
			return res.send(err);
		}

	  	res.json({
			success: true,
			data: languages
		});
	});
};
