const orderBy = require("lodash").orderBy;

const mongoose = require("mongoose");
// mongoose.Promise = Promise;
// mongoose.connect('mongodb://localhost/MindSalesCRM');

const Field = require("../../models/field");
const Contact = require("../../models/contact")();

const errorCallback = error => { throw error; };

module.exports = function getFieldStats( fieldObject, accountsList, startDateString ) {

    const startDate = new Date( startDateString ).toISOString();
    const field = mongoose.Types.ObjectId( fieldObject.id.toString() );

    return Field.findOne({ _id: field })
        .then( ({ list, id }) => ({ list, id }) )
        .then( findContactsCountForField )
        .then( findContactsForField )
        .catch( errorCallback );

    function findContactsCountForField({ list, id }) {
        let query = {};
        query.$or = accountsList.map(
            account => ({ account: mongoose.Types.ObjectId( account.id ) })
        );
        query[id] = { $exists: true };
        query.created =  { $gte: startDate };

        return Contact.find( query ).count()
            .then( generalCount => ({ list, id, generalCount }))
            .catch( errorCallback );
    }

    function findContactsForField({ list, id, generalCount}) {
        let query = {};
        query.$or = accountsList.map(
            account => ({ account: mongoose.Types.ObjectId( account.id ) })
        );

        const pipeline = list.map( val => {

            const value = val.replace('\r','');
            query[id] = value;
            query.created =  { $gte: startDate };

            return Contact.find( query ).count()
                .then( count => ({ value, count, percents: (count/generalCount * 100).toFixed(2) }))
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


// getFieldStats(
//     { id : "57ef9d477d53c326f17b97bb", name : "Сумма займа" },
//     [
//         { name: 'Астана', id: '57ef9d477d53c326f17b97b5' },
//         { name: 'Aлмата', id: '57efa0f67d53c326f17b97c1' }
//     ],
//     '2016-12-01'
// )
//     .then( console.log )
//     .catch( console.log );