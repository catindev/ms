const mapKeys = require("lodash").mapKeys;
const findByUser= require("./stats-by-manager");

const errorCallback = error => { throw error; };

module.exports = function calculateAllStats( managers, dateString ) {

    const pipeline = managers.map( manager => findByUser( manager, dateString ) );

    return Promise.all( pipeline )
        .then( printResults )
        .catch( errorCallback );

    function printResults( results ) {
        return results;
        // TODO: посчитает только два аккаунта. переделать если больше
        if ( results.length > 1 ) {
            const joined = {};
            mapKeys( results[0], (value, key) => joined[key] = results[1][key] + value );
            return joined;
        }

        return results[0];
    }
};