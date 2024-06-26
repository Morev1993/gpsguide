var Waypoint = require(__base + 'models/waypoint'),
    AudioFile = require(__base + 'models/audiofile'),
    fs = require("fs"),
    multiparty = require('multiparty'),
    crypto = require('crypto'),
    mkdirp = require('mkdirp'),
    deleteFolderRecursive = require(__base + 'helpers').deleteFolderRecursive,
    config = require(__base + 'config/config');

exports.create = function(req, res, next) {
	var tourId = req.params.tourId;
    var name = req.body.name;
	var lat = req.body.lat;
	var lng = req.body.lng;
    var direction = req.body.direction;
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

	if (!lat || !lng) {
        return res.status(422).send({
            error: 'Coords is empty.'
        });
    }

	var waypoint = new Waypoint({
		tourId,
        name,
		lat,
		lng,
		tolerance,
        direction,
		delay,
		overlap,
		radius,
        orderBy
    });

	waypoint.save().then(waypoint => {
        res.status(201).json({
            success: true,
            data: waypoint
        });
    }).catch(err => {
        console.log(err)
        return next(err);
    });
};

exports.createFiles = function(req, res, next) {
    var tourId = req.params.tourId;
    var waypointId = req.params.id;

    if (typeof waypointId === 'undefined') {
        return res.status(422).send({
            error: 'waypointId is undefined.'
        });
    }

    var form = new multiparty.Form();
    var uploadFile = {path: '', type: '', size: 0, filename: ''};
    var supportMimeTypes = ['audio/mp3'];
    var errors = [];
    var data = [];
    var maxSize = 100 * 1024 * 1024;

    form.on('error', function(err) {
        if(fs.existsSync(uploadFile.path)) {
            //если загружаемый файл существует удаляем его
            fs.unlinkSync(uploadFile.path);
            console.log('Error parsing form: ' + err.stack);
        }
    });

    form.on('part', function(part) {
        uploadFile.size = part.byteCount;
        uploadFile.type = part.headers['content-type'];
        uploadFile.filename = part.filename;
        uploadFile.langId = part.name.split('_')[1];
        uploadFile.langCode = part.name.split('_')[2];

        if(uploadFile.size > maxSize) {
            errors.push('File size is ${uploadFile.size}. Limit is ${(maxSize / 1024 / 1024)} MB.');
        }

        if (supportMimeTypes.indexOf(uploadFile.type) == -1) {
        	console.log('Unsupported mimetype ' + uploadFile.type);
            errors.push('Unsupported mimetype ' + uploadFile.type);
            part.resume();
        }

        var folder = `${global.__base}public/${waypointId}/`;

        mkdirp(folder, function (err) {
            if (err) return next(err);

            var name = crypto.createHash('md5').update(part.filename).digest("hex")
            uploadFile.path = `${folder}${name}.mp3`;
            var relativePath = `public/${req.params.id}/${name}.mp3`

            data.push({
	        	langId: uploadFile.langId,
                path: relativePath,
                langCode: uploadFile.langCode
	        });

            if (errors.length == 0) {
                var out = fs.createWriteStream(uploadFile.path);

                part.pipe(out);
            } else {
                part.resume();
            }
        });
    })

    form.on('close', function() {
        //если нет ошибок и все хорошо
        if (errors.length == 0) {
            //сообщаем что все хорошо

            console.log('Upload completed!');

            data.forEach(function(item) {
            	var languageId = item.langId;
                var langCode = item.langCode;
                var path = item.path;

        		var audioFile = new AudioFile({
	                waypointId,
	                languageId,
                    tourId,
                    langCode,
                    path
	            })

	            audioFile.save().then((file) => {
	                res.status(201).json({
	                    success: true,
	                    data: file
	                });
	            }).catch((err) => {
	                return next(err);
	            });
            })



        } else {
            if (fs.existsSync(uploadFile.path)) {
                //если загружаемый файл существует удаляем его
                fs.unlinkSync(uploadFile.path);
            }
            //сообщаем что все плохо и какие произошли ошибки
            res.send({success: true, errors: errors});
        }
    });

    form.parse(req);
};

exports.getFiles = function(req, res) {
    AudioFile.find({
        waypointId: req.params.id
    }, function(err, files) {
        if (err) {
            return res.send(err);
        }

        files.forEach(file => {
            console.log(`${config.url}/${file.path}`);
            file.path = `${config.url}/${file.path}`;
        });

        res.json({
            success: true,
            data: files
        });
    });
};

exports.deleteFile = function(req, res, next) {
    AudioFile.findOne({
        _id: req.params.fileId,
        waypointId: req.params.id
    }).then(file => {
        var filePath = `${global.__base}${file.path}`;
        console.log(filePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return AudioFile.remove({
    		_id: req.params.fileId,
            waypointId: req.params.id
        });
    }).then(result => {
        res.json({
            success: true,
            data: {
                result: result,
                _id: req.params.fileId
            }
        });
    })
};

exports.getAll = function(req, res) {
    Waypoint.find({
        tourId: req.params.tourId
    }, function(err, waypoints) {
        if (err) {
            return res.send(err);
        }

        res.json({
            success: true,
            data: waypoints
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

exports.delete = function(req, res, next) {
    Waypoint.remove({
		_id: req.params.id,
        tourId: req.params.tourId
    }).then(result => {
        return AudioFile.remove({
            waypointId: req.params.id
        });
    }).then(result => {
        var folder = `${global.__base}public/${req.params.id}`;
        deleteFolderRecursive(folder);

        res.json({
            success: true,
            data: {
                result: result,
                _id: req.params.id
            }
        });
    }).catch(err => {
        return next(err);
    });
}
