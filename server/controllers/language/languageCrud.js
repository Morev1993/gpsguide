var Language = require(__base + 'models/language');
var UserLanguage = require(__base + 'models/userLanguage');
var mongoose = require('mongoose');

exports.getAll = function(req, res) {
	Language.find({}, function(err, languages) {
		if (err) {
			return res.send(err);
		}

	  	res.json({
			success: true,
			data: languages
		});
	});
};


exports.getActives = function(req, res, next) {
	UserLanguage.find({
        accountId: req.user._id
    }).then((languages) => {
		var langsId = [];

		languages.forEach(lang => {
			langsId.push(lang.languageId);
		});

		return Language.find({
            'id': { $in: langsId}
        });
	}).then(languages => {
		res.json({
		  success: true,
		  data: languages
	  });
  }).catch(err => {
	  return next(err);
  });
};

exports.get = function(req, res) {
    Language.findOne({
        id: req.params.id,
		accountId: req.user._id
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

exports.update = function(req, res, next) {
	var languageId = req.params.id;
	var accountId = req.user._id;

    UserLanguage.findOne({
        languageId: languageId,
		accountId: accountId
    }).then((language) => {
		if (!language) {
			var userLanguage = new UserLanguage({
				accountId,
				languageId
			});

			return userLanguage.save();
		} else {
			return UserLanguage.remove({
		        languageId: languageId,
				accountId: accountId
		    });
		}

	}).then((language) => {
		if (language.result && language.result.ok === 1) {
			res.json({
	            success: true,
	            data: {
					result: language.result,
					id: languageId
				}
	        });
		} else {
			res.json({
	            success: true,
	            data: language
	        });
		}
	}).catch(err => {
		return next(err);
	})
};
