var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//================================
// User Schema
//================================
var LanguageSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    locale: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    orderBy: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Language', LanguageSchema);
