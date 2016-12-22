var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//================================
// User Schema
//================================
var LanguageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    locale: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    orderBy: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Language', LanguageSchema);
