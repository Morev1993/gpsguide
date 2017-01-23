var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//================================
// Tour Schema
//================================
var TourSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    orderBy: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    languages: {
        type: [Number],
        default: []
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Tour', TourSchema);
