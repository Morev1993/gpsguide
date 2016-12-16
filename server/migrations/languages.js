var fs = require('fs');
var Language = require('../models/language');
var config = require('../config/main');
var mongoose = require('mongoose');

mongoose.connect(config.database);

mongoose.connection.collections['languages'].drop( function(err) {
	if (err) throw err;
    console.log('collection dropped');

	fs.readFile('../test-json/languages.json', (err, data) => {
	  if (err) throw err;

	  var arr = JSON.parse(data);

	  Language.create(arr, function (err, languages) {
		  if (err) throw err;

		  console.log('import done');
		  console.log(languages.length + ' elements is added');

		  mongoose.disconnect();
	  });
	});
});
