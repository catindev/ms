const { dateToISO } = require('./helpers');

// TODO: геморно, попробовать функционально
module.exports = function getCustomersWithoutProfile({ Contact, ObjectId }) {

    const query = ({ account, date }) => ({
        account: ObjectId(account),
        created: {
            $gte: dateToISO(date.start),
            $lt: dateToISO(date.end)
        },
        name: { $exists: false }
    });

    const assign = (state = {}) => contacts => Object.assign({}, state, {
        no_profile: contacts.map( contact => contact._id) || false
    });

    return function( reportConfig ) {
        return function( state ) {
            return Contact
                .find( query(reportConfig) )
                .then( assign(state) )
                .catch( error => { throw error })
            ;
        }
    }
};
