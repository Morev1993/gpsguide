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
    lon: {
        type: Number,
        required: true
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
        type: [String],
        default: ['ignore', 'interrupt', 'queue']
    },
    radius : {
        type: Number,
        default: 30
    },
    orderBy: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Waypoint', WaypointSchema);
