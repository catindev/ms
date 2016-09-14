const mongoose = require("mongoose");
const Account = require("./account");

const Schema = mongoose.Schema;

const callSchema = new Schema({
    "account": { type: Schema.Types.ObjectId, ref: 'Account' },
    "contact": { type: Schema.Types.ObjectId, ref: 'Contact' },
    "number": { type: Schema.Types.ObjectId, ref: 'Number' },
    "direction": Number,
    "date": { type: Date },
    "answerDate": { type: Date },
    "status": Number,
    "duration": {
        "waiting": Number,
        "call": Number,
        "conversation": Number
    },
    "maxDuration": {
        "waiting": Boolean, "answer": Boolean
    },
    "recordFile": String,
    "display": {
        "call": String,
        "waiting": String,
        "conversation": String
    }
});


callSchema.pre('save', function(next) {
    if ( !this.isModified() ) return next();

    Account.findById( this.account, (err, account) => {
        if (err) throw err;

        this.maxDuration.waiting = this.duration.waiting <= account.maxWaitingTime;
        this.maxDuration.answer = this.duration.conversation <= account.maxAnswerTime;
        next();
    });
});


module.exports = mongoose.model('Call', callSchema);