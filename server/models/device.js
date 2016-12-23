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
        type: String,
        default: '0'
    },
    orderBy: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Device', DeviceSchema);
