var Waypoint = require(__base + 'models/waypoint'),
    AudioFile = require(__base + 'models/audiofile'),
    config = require(__base + 'config/main'),
    mongoose = require('mongoose');

exports.getAll = function(req, res) {
    var waysId = [];
    var ways = [];
    Waypoint.find({
        tourId: req.params.tourId
    }).then((waypoints) => {
        ways = waypoints;

        ways.forEach(function(way) {
            waysId.push(mongoose.Types.ObjectId((way._id)))
        });

        return AudioFile.find({
            'waypointId': { $in: waysId}
        });
    }).then((audioFiles) => {
        res.json({
            success: true,
            data: {
                waypoints: ways,
                audioFiles: audioFiles
            }
        });
    }).catch((err) => {
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
        res.json({
            success: true,
            data: {
                waypoint: way,
                audioFiles: audioFiles
            }
        });
    }).catch((err) => {
        return res.send(err);
    })
};
