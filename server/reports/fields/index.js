const findByField = require("./stats-by-field");
const errorCallback = error => { throw error; };

module.exports = function calculateAllStats( fields, accounts, dateString ) {

    const pipeline = fields.map( field => findByField( field, accounts, dateString ) );

    return Promise.all( pipeline )
        .then( results => results )
        .catch( errorCallback );

    function printResults( results ) {
        return results;
    }
};