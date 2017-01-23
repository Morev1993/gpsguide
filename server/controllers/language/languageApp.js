var Language = require(__base + 'models/language');
var UserLanguage = require(__base + 'models/UserLanguage');
var mongoose = require('mongoose');

exports.getActives = function(req, res, next) {
	UserLanguage.find({
        accountId: req.user.accountId
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
