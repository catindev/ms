const mongoose = require("mongoose");
const formatNumber = require("../api/format-number");

const Schema = mongoose.Schema;

const numberSchema = new Schema({
    "account": {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    "phone": String,
    "name": String
});

numberSchema.pre('save', function(next) {
    if (!this.isModified('phone')) return next();

    this.phone = formatNumber(this.phone);

    next();
});

module.exports = mongoose.model('Number', numberSchema);