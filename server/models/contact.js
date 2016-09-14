const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const type = mongoose.Schema.Types.ObjectId;

const contactSchema = new Schema({
    "account": { type, ref: 'Account' },
    "user": { type, ref: 'User' },
    "number": {  type, ref: 'Number' },
    "created": { type: Date },
    "name": String,
    "phone": String,
    "email": String,
    "notes": String
});

module.exports =  function createContactModel( customFields = false ) {
    if ( customFields ) {
        for (let i in customFields) {
            const field = customFields[ i ];
            let _field = { type: String };
            field.type === 'list' && ( _field.enum = field.list );
            contactSchema[ field.id ] = _field;
        }
    }
    return mongoose.model( 'Contact', contactSchema );
};