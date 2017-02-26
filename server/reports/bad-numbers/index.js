const orderBy = require("lodash").orderBy;
const generalStats = require('../general');
const numbersStats = require('../numbers');

const errorCallback = error => { throw error; };

module.exports = function calculateBadNumbersStats( accounts, numbers, dateString ) {
    return generalStats( accounts, dateString )
        .then( calculateBadNumbers )
        .catch( errorCallback );

    function calculateBadNumbers( general ) {

        const remap = numbers => numbers.map(
            number => ({
                name: number.name,
                count : number['invalid customers']
            })
        );

        const format = count => numbers => ({ count, numbers });
        const formatOutput = format( general['invalid customers'] );

        const orderByCount = ({ count, numbers }) => ({
            count, numbers: orderBy(numbers, 'count', 'desc')
        });

        return numbersStats( numbers, dateString )
            .then( remap )
            .then( formatOutput )
            .then( orderByCount )
            .catch( errorCallback );
    }
};