const mongoose = require("mongoose");
const Contact = require("../models/contact")();

const findCallback = (results, paramName) => dataLength => {
    results[ paramName ] = dataLength;
    return results;
};

const errorCallback = error => { throw error; };

module.exports = function findByAccount( accountObject, startDateString ) {
    const startDate = new Date( startDateString ).toISOString();

    const account = mongoose.Types.ObjectId( accountObject.id.toString() );

    const findAllNewCustomers = accountName => allCount => ({
        'account name': accountName,
        'all customers': allCount
    });


    return Contact.find({ account, created: { $gte: startDate } })
        .count()
        .then( findAllNewCustomers( accountObject.name ) )
        .then( findCustomersWithoutProfile )
        .then( findValidCustomers )
        .then( findInvalidCustomers )
        .then( printData )
        .catch( errorCallback );

    function findCustomersWithoutProfile( resultData ) {
        // console.log('findCustomersWithoutProfile ok');
        return Contact.find({
            account, created: { $gte: startDate }, name: { $exists: false }
        })
            .count()
            .then( findCallback( resultData, 'without profile' ) )
            .catch( errorCallback );
    }

    function findValidCustomers( resultData ) {
        // console.log('findValidCustomers ok');
        return Contact.find({
            account, created: { $gte: startDate },
            noTargetReason: { $exists: false },
            name: { $exists: true }
        })
            .count()
            .then( findCallback( resultData, 'valid customers' ) )
            .catch( errorCallback );
    }


    function findInvalidCustomers( resultData ) {
        // console.log('findInvalidCustomers ok');
        return Contact.find({
            account, created: { $gte: startDate },
            noTargetReason: { $exists: true },
            name: { $exists: true }
        })
            .count()
            .then( findCallback( resultData, 'invalid customers' ) )
            .catch( errorCallback );
    }

    //////// Results ///////////////////////////////////

    function printData( data ) {
        // console.log('printData ok');
        return data;
    }

};


// findByAccount( '57ef9d477d53c326f17b97b5', '2016-11-30T18:00:00.000Z' )
//     .then( results => {
//         // console.log('Results:');
//         // console.log( '  All:', results['all customers'] );
//         // console.log( '  Without profile:', results['without profile'] );
//         // console.log( '  Valid customers:', results['valid customers'] );
//         // console.log( '  Invalid customers:', results['invalid customers'] );
//     });