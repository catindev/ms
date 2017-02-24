// const mongoose = require("mongoose");
// mongoose.Promise = Promise;
// mongoose.connect('mongodb://localhost/MindSalesCRM');

const mapKeys = require("lodash").mapKeys;

const findByAccount = require("./find-by-account");

const errorCallback = error => { throw error; };

module.exports = function calculateAllStats( accounts, dateString ) {
    const pipeline = accounts.map(
        account => findByAccount( account.name, account.id, dateString )
    );

    return Promise.all( pipeline )
        .then( printResults )
        .catch( errorCallback );

    function printResults( results ) {
        const joined = {};
        mapKeys(
            results[0],
            (value, key) => joined[key] = results[1][key] + value
        );
        console.log('Results:');
        console.log( '  All:', joined['all customers'] );
        console.log( '  Without profile:', joined['without profile'] );
        console.log( '  Valid customers:', joined['valid customers'] );
        console.log( '  Invalid customers:', joined['invalid customers'] );
        return joined;
    }
};