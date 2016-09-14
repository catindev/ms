const Contact = require("../../models/contact")();
const missedСalls = require('./fetch-missed');

function newContactsCount({ user }) {
    return new Promise((resolve, reject) => {
        Contact
            .find({ user: user && user._id })
            .select({ "_id": 1, name: 1 })
            .exec((error, contacts) => {
                if ( error ) reject(error);
                if ( !contacts || contacts.length === 0) return resolve(0);

                const newContacts = contacts.filter( contact => !contact.name );
                resolve( newContacts.length );
            });
    });
}

function missedСallsCount( params ) {
    return new Promise((resolve, reject) => {
        try {
            missedСalls( params, calls => {
                if ( !calls || calls.length === 0 ) return resolve(0);
                resolve( calls.length );
            });
        } catch( error ){
            reject( error );
        }
    });
}

module.exports = function fetchMetaInfo( params, callback ) {
    Promise.all([
        newContactsCount( params ),
        missedСallsCount( params )
    ])
        .then(
            results => callback({
                newContacts: results[0],
                missed: results[1],
            })
        )
        .catch( error => { throw error });
};