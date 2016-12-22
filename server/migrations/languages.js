global.__base = __dirname + '/../';

var fs = require('fs');
var Language = require(__base + 'models/language');
var config = require(__base + 'config/main');
var mongoose = require('mongoose');

mongoose.connect(config.database);

Language.remove({}, function(err) { 
	if (err) throw err;
    console.log('collection dropped');

	fs.readFile(__base + 'test-json/languages.json', (err, data) => {
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
