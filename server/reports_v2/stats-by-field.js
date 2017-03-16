const orderBy = require("lodash").orderBy;
const mongoose = require("mongoose");

const Field = require("../../models/field");
const Contact = require("../../models/contact")();

const errorCallback = error => { throw error; };

let fieldz;

module.exports = function getFieldStats( account, startDateString, endDateString) {

    const startDate = new Date( startDateString ).toISOString();
    const endDate = new Date( endDateString ).toISOString();
    const account = mongoose.Types.ObjectId( account );

    return Field.find({ account })
        .then( findContactsCountForFields )
        .then( findContactsForField )
        .catch( errorCallback );

    function findContactsCountForFields( fields ) {
        fieldz = fields;

        const pipeline = fields.map( field => {
            let query = { account };
            query[field.id] = { $exists: true };
            query.created =  { $gte: startDate };
            return Contact.find(query).count();
        });

        return Promise.all( pipeline );
    }

    function findContactsForField( results ) {
        let query = {};
        query.$or = accountsList.map(
            account => ({ account: mongoose.Types.ObjectId( account.id ) })
        );

        const pipeline = list.map( val => {

            const value = val.replace('\r','');
            query[id] = value;
            query.created =  { $gte: startDate };

            return Contact.find( query ).count()
                .then( count => ({
                    value, count,
                    percents: calcPercents(count, generalCount)
                }))
                .catch( errorCallback );
        });

        return Promise.all( pipeline )
            .then( results => ({
                name: fieldObject.name,
                values: orderBy(results.filter( result => result.value && result.count > 0 ), 'count', 'desc')
            }))
            .catch( errorCallback );

    }
};
