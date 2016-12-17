var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

//================================
// User Schema
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

// Pre-save of user to database, hash password if password is modified or new
DeviceSchema.pre('save', function(next) {
    var device = this,
        SALT_FACTOR = 5;

    if (!device.isModified('authCode')) return next();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(device.authCode, salt, null, function(err, hash) {
            if (err) return next(err);
            device.authCode = hash;
            next();
        });
    });
});

// Method to compare password for login
DeviceSchema.methods.compareAuthCode = function(candidateAuthCode, cb) {
    bcrypt.compare(candidateAuthCode, this.authCode, function(err, isMatch) {
        if (err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
}


module.exports = mongoose.model('Device', DeviceSchema);
