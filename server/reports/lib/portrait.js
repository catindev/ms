const _ = require("lodash");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Field = require("../../models/field");
const Contact = require("../../models/contact")();

const _h = require("./helpers");

let fieldz;

const calcPortrait = ({ account, date }) => collection => {

    return Field.find({ account: ObjectId(account), type: 'list' })
        .then( findContactsCountForFields )
        .then( findContactsForField )
        .catch( error => { throw error; } );

    function findContactsCountForFields( fields ) {
        fieldz = fields;

        const pipeline = fields.map( field => {
            let query = { account };
            query[field.id] = { $exists: true };
            query.created = { $gte: _h.dateToISO(date.start), $lt: _h.dateToISO(date.end) };
            return Contact.find(query);
        });

        return Promise.all( pipeline );
    }

    function findContactsForField( results ) {

        const portrait = fieldz.map( (field, index) => {
            const fieldName = field.name;
            let data = { field: fieldName, count: results[index].length };

            if ( results[index].length === 0 ) {
                data.values = false;
                return data;
            }

            data.values = [];
            const customers = results[index];
            field.list.forEach( value => {
                const val = value.replace(/(\r\n|\n|\r)/gm,"");

                const search = customers.filter( customer => {
                    const clone = customer.toObject();
                    return clone[field.id] === val;
                });

                const count = search ? search.length : 0;
                data.values.push({ name: val, count })
            });

            data.values = _.orderBy(data.values, 'count', 'desc');
            data.values = data.values.filter( value => value.count > 0);
            data.values.length === 0 && (data.values = false );
            return data;
        });

        return Object.assign({}, collection, { portrait });
    }
};

module.exports = calcPortrait;
