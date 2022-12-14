var Waypoint = require(__base + 'models/waypoint'),
    AudioFile = require(__base + 'models/audiofile'),
    mongoose = require('mongoose'),
    config = require(__base + 'config/config'),
    md5File = require('md5-file');

exports.getAll = function(req, res) {
    var waysId = [];
    var ways = [];
    Waypoint.find({
        tourId: req.params.tourId
    }).then(waypoints => {
        ways = waypoints;

        if (!waypoints.length) {
            res.status(422).json({
                success: false,
                error: "Wrong tour id"
            });
        }

        ways.forEach(way => {
            waysId.push(mongoose.Types.ObjectId((way._id)))
        });

        return AudioFile.find({
            'waypointId': { $in: waysId}
        });
    }).then(audioFiles => {
        ways.forEach(way => {
            audioFiles.forEach(file => {
                if (way._id.equals(file.waypointId)) {
                    file.checksum = md5File.sync(`${__base}${file.path}`);
                    file.path = `${config.url}/${file.path}`;
                    way.audiofiles.push(file);
                }
            });
        });
        res.json({
            success: true,
            data: ways
        });
    }).catch(err => {
        return res.send(err);
    })
};

exports.get = function(req, res) {
    var way = {};
    Waypoint.findOne({
        _id: req.params.id,
        tourId: req.params.tourId
    }).then((waypoint) => {
        way = waypoint;
        return AudioFile.find({
            waypointId: waypoint._id
        });
    }).then((audioFiles) => {
        way.audiofiles = audioFiles;

        way.audiofiles.forEach(file => {
            file.checksum = md5File.sync(`${__base}${file.path}`);
            file.path = `${config.url}/${file.path}`;
        });

        res.json({
            success: true,
            data: way
        });
    }).catch((err) => {
        return res.send(err);
    })
};
