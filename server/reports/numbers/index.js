const findByNumber= require("./stats-by-number");
const errorCallback = error => { throw error; };

module.exports = function calculateAllStats( numbers, dateString ) {

    const pipeline = numbers.map( number => findByNumber( number, dateString ) );

    return Promise.all( pipeline )
        .then( printResults )
        .catch( errorCallback );

    function printResults( results ) {
        return results;
    }
};