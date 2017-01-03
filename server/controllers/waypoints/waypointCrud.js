var jwt = require('jsonwebtoken'),
    Waypoint = require(__base + 'models/waypoint'),
    AudioFile = require(__base + 'models/audiofile'),
    fs = require("fs"),
    multiparty = require('multiparty'),
    config = require(__base + 'config/main'),
    crypto = require('crypto');

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

	waypoint.save().then((waypoint) => {
        res.status(201).json({
            success: true,
            data: waypoint
        });


    }).catch((err) => {
        return next(err);
    });
};

exports.createFiles = function(req, res) {
    var form = new multiparty.Form();

    var uploadFile = {path: '', type: '', size: 0};

    var supportMimeTypes = ['audio/mp3'];

    var errors = [];

    console.log(req.params.id)

    form.on('close', function() {
        //если нет ошибок и все хорошо
        if(errors.length == 0) {
            //сообщаем что все хорошо
            res.send({status: 'ok', text: 'Success'});
        }
        else {
            if(fs.existsSync(uploadFile.path)) {
                //если загружаемый файл существует удаляем его
                fs.unlinkSync(uploadFile.path);
            }
            //сообщаем что все плохо и какие произошли ошибки
            res.send({status: 'bad', errors: errors});
        }
    });

    form.on('part', function(part) {
        uploadFile.size = part.byteCount;
        //читаем его тип
        uploadFile.type = part.headers['content-type'];
        //путь для сохранения файла

        var name = crypto.createHash('md5').update(part.filename).digest("hex")
        uploadFile.path = __base + '/public/' + name + '.mp3';

        if (supportMimeTypes.indexOf(uploadFile.type) == -1) {
            errors.push('Unsupported mimetype ' + uploadFile.type);
        }

        if (errors.length == 0) {
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        }
        else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
    })

    form.parse(req);
}

exports.getAll = function(req, res) {
    Waypoint.find({
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

exports.delete = function(req, res) {
    Waypoint.remove({
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
}
