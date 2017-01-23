var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//================================
// User Schema
//================================
var UserLanguageSchema = new Schema({
    accountId: {
		type: Schema.Types.ObjectId,
        required: true
    },
	languageId: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('UserLanguage', UserLanguageSchema);
