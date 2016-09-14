const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomField = new Schema({
    "account": {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    "name": String,
    "id": String,
    "type": String,
    "list": [String],
    "description": String
});

module.exports = mongoose.model('CustomField', CustomField);