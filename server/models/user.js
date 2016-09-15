const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const crypto = require("crypto");
function md5(data) {
    return crypto
        .createHash('md5')
        .update( data )
        .digest('hex');
}

const formatNumber = require("../api/format-number");

const userSchema = new Schema({
    "account": {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    "created": {
        type: Date,
        default: Date.now()
    },
    "access": { type: String, enum: ['boss', 'manager'] },
    "type": { type: String, enum: ['customer', 'admin'] },
    "name": String,
    "phone": String,
    "email": String,
    "password": String,
    "session": String
});


userSchema.pre('save', function( next ) {
    if ( !this.isModified('password') ) return next();
    this.password = md5(this.password + 'wow! much salt!');

    this.phone = formatNumber(this.phone);

    next();
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    this.session = '';

    const isMatch = this.password === md5(candidatePassword + 'wow! much salt!');

    isMatch && (
        this.session = md5( `${ new Date().getTime() }@${ this.password }@${ Math.random() }` )
    );

    this.save(err => {
        if (err) throw err;
        cb(null, this.session);
    });
};


module.exports = mongoose.model('User', userSchema);