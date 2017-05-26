const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    "user": {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    "token": String,
    "created": {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Session', sessionSchema);