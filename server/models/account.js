const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new Schema({
    "name": String,
    "maxWaitingTime": Number,
    "maxAnswerTime": Number,
    "noTargetReasons": [String],
    "created": {
        type: Date,
        default: Date.now()
    }
});

accountSchema.pre('save', function(next) {
    if ( !this.isModified() ) return next();

    this.maxWaitingTime = this.maxWaitingTime * 1000;
    this.maxAnswerTime = this.maxAnswerTime * 1000;

    next();
});

module.exports = mongoose.model('Account', accountSchema);