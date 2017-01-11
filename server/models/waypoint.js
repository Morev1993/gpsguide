var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//================================
// Device Schema
//================================

//233 Alton Rd
var WaypointSchema = new Schema({
    tourId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    direction: {
        type: String,
        default: 'N'
    },
    tolerance: {
        type: Number,
        default: 30
    },
    delay: {
        type: Number,
        default: 0
    },
    overlap: {
        type: String,
        default: 'ignore'
    },
    radius : {
        type: Number,
        default: 30
    },
    orderBy: {
        type: Number,
        default: 0
    },
    audiofiles: {
        type: []
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Waypoint', WaypointSchema);
