const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const type = mongoose.Schema.Types.ObjectId;

let schema = {
    "account": { type, ref: 'Account' },
    "user": { type, ref: 'User' },
    "number": {  type, ref: 'Number' },
    "created": { type: Date },
    "name": String,
    "phone": String,
    "email": String,
    "notes": String
};
const contactSchema = new Schema(schema);

module.exports = function ( customFields = false ) {
    if ( customFields ) {
        for (let i in customFields) {
            const field = customFields[ i ];
            if ( field.type === 'list' ) {
                let f = {};
                f[ field.id ] = { type: String, enum: field.list };
                contactSchema.add(f);
            } else {
                let f = {};
                f[ field.id ] = { type: String };
                contactSchema.add(f);
            }
        }
    }
    return mongoose.model( 'Contact', contactSchema );
};