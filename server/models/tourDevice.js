var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//================================
// User Schema
//================================
var TourDeviceSchema = new Schema({
    deviceId: {
		type: Schema.Types.ObjectId,
        required: true
    },
	tourId: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TourDevice', TourDeviceSchema);
