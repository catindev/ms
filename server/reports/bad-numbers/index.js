
const generalStats = require('../general');
const numbersStats = require('../numbers');

const errorCallback = error => { throw error; };

module.exports = function calculateBadNumbersStats( accounts, numbers, dateString ) {
    return generalStats( accounts, dateString )
        .then( calculateBadNumbers )
        .catch( errorCallback );

    function calculateBadNumbers( general ) {

        return numbersStats( numbers, dateString )
            .then( calculate )
            .then( remap( general['invalid customers'] ) )
            .catch( errorCallback );

        function calculate( numbers ) {
            return numbers.map(
                number => ({ name: number.name, count : number['invalid customers'] })
            );
        }

        function remap( count ) {
            return function( numbers ) {
                return { count, numbers }
            }
        }
    }
};