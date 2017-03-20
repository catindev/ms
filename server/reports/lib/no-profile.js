const { dateToISO } = require('./helpers');

module.exports = function getCustomersWithoutProfile({ Contact, ObjectId }) {

    const query = ({ account, date }) => ({
        account: ObjectId(account),
        created: {
            $gte: dateToISO(date.start),
            $lt: dateToISO(date.end)
        },
        name: { $exists: false }
    });

    const mapID = ({ _id }) => _id;
    const assign = (state = {}) => contacts => Object.assign({}, state, {
        no_profile: contacts.map( mapID ) || false
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
