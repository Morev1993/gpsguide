var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//================================
// Device Schema
//================================

//233 Alton Rd
var AudioFileSchema = new Schema({
    waypointId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    languageId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    path: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('AudioFile', AudioFileSchema);
