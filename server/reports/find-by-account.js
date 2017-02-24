const mongoose = require("mongoose");
const Contact = require("../models/contact")();

const findCallback = (results, paramName) => dataLength => {
    results[ paramName ] = dataLength;
    return results;
};

const errorCallback = error => { throw error; };

module.exports = function findByAccount( accountNameString, accountIDString, startDateString ) {

    const startDate = new Date( startDateString ).toISOString();
    const account = mongoose.Types.ObjectId( accountIDString );
    const findAllNewCustomers = allCount => ({
        'account name': accountNameString,
        'all customers': allCount
    });

    return Contact.find({ account, created: { $gte: startDate } })
        .count()
        .then( findAllNewCustomers )
        .then( findCustomersWithoutProfile )
        .then( findValidCustomers )
        .then( findInvalidCustomers )
        .then( printData )
        .catch( errorCallback );

    function findCustomersWithoutProfile( resultData ) {
        return Contact.find({
            account, created: { $gte: startDate }, name: { $exists: false }
        })
            .count()
            .then( findCallback( resultData, 'without profile' ) )
            .catch( errorCallback );
    }

    function findValidCustomers( resultData ) {
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
        return data;
    }

};


// findByAccount( '57ef9d477d53c326f17b97b5', '2016-11-30T18:00:00.000Z' )
//     .then( results => {
//         console.log('Results:');
//         console.log( '  All:', results['all customers'] );
//         console.log( '  Without profile:', results['without profile'] );
//         console.log( '  Valid customers:', results['valid customers'] );
//         console.log( '  Invalid customers:', results['invalid customers'] );
//     });