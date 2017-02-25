const mapKeys = require("lodash").mapKeys;

const findByAccount = require("./stats-by-account");

const errorCallback = error => { throw error; };

module.exports = function calculateAllStats( accounts, dateString ) {

    const pipeline = accounts.map( account => findByAccount( account, dateString ) );

    return Promise.all( pipeline )
        .then( printResults )
        .catch( errorCallback );

    function printResults( results ) {
        
        // TODO: посчитает только два аккаунта. переделать если больше
        if ( results.length > 1 ) {
            const joined = {};
            mapKeys( results[0], (value, key) => joined[key] = results[1][key] + value );
            return joined;
        }

        return results[0];
    }
};