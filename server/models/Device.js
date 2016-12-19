var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//================================
// Device Schema
//================================
var DeviceSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    authCode: {
        type: Number,
        unique: true,
        required: true
    },
    token: {
        type: String,
        default: ''
    },
    device: {
        type: String,
        default: ''
    },
    version: {
        type: Number,
        default: 0
    },
    orderBy: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'unactive'
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Device', DeviceSchema);
