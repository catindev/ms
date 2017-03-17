const _ = require("lodash");
const mongoose = require("mongoose");

const Field = require("../models/field");
const Contact = require("../models/contact")();

const errorCallback = error => { throw error; };

let fieldz;

module.exports = function getFieldStats( account, startDate, endDate, collection ) {

    return Field.find({ account, type: 'list' })
        .then( findContactsCountForFields )
        .then( findContactsForField )
        .catch( errorCallback );

    function findContactsCountForFields( fields ) {
        fieldz = fields;

        const pipeline = fields.map( field => {
            let query = { account };
            query[field.id] = { $exists: true };
            query.created =  { $gte: startDate };
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
            data.values = data.values.filter( value => value.count > 1);
            data.values.length === 0 && (data.values = false );
            return data;
        });

        return Object.assign({}, collection, { portrait });
    }
};
