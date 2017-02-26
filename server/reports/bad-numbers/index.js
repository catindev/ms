
const generalStats = require('../general');
const numbersStats = require('../numbers');

const errorCallback = error => { throw error; };

module.exports = function calculateBadNumbersStats( accounts, numbers, dateString ) {
    return generalStats( accounts, dateString )
        .then( calculateBadNumbers )
        .catch( errorCallback );

    function calculateBadNumbers( general ) {

        const remap = numbers => numbers.map(
            number => ({ name: number.name, count : number['invalid customers'] })
        );
        const format = count => numbers => ({ count, numbers });
        const formatOutput = format( general['invalid customers'] );

        return numbersStats( numbers, dateString )
            .then( remap )
            .then( formatOutput )
            .catch( errorCallback );
    }
};