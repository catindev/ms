const User = require("../../models/user");
const Number = require("../../models/number");
const Contact = require("../../models/contact")();
const Account = require("../../models/account");
const Call = require("../../models/call");

const errorHandler = error => { throw error };

const populateQuery = [ { path: 'number', model: 'Number' } ];

const calcLt = date => date.getTime() + 86400000;

function findContactsForNumber( number, start, end ) {
    const query = {
        number: number._id,
        created: {
            $gte: start.getTime(),
            $lt: calcLt( end )
        }
    };

    return new Promise((resolve, reject) => {
        try {

            Contact
                .find( query )
                .sort( '_id' )
                .populate( populateQuery )
                .exec( findContacts );

            function findContacts( error, contacts ) {
                if ( error ) throw error;
                const length = contacts && contacts.length > 0
                    ? contacts.length : 0;

                console.log(':D stats contacts',contacts )
                resolve([ number.name, length ]);
            }

        } catch( error ) { reject( error ); }
    });
}


function pieChart({ start, end, account }) {

    return Number
        .find({ account: account._id })
        .then( calculateContacts )
        .catch( errorHandler )


    function calculateContacts( numbers ) {
        if ( !numbers || numbers.length === 0 )
            throw new Error("Рекламные источники не найдены");

        const pipeline = numbers.map(
            number => findContactsForNumber( number, start, end )
        );

        return Promise.all( pipeline )
            .then( results => results )
            .catch( errorHandler );
    }

}

module.exports = pieChart;