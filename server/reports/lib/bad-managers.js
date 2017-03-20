const { dateToISO } = require('./helpers');

module.exports = function getBadManagers({ Contact, User, ObjectId }) {

    const query = ({ account, date }) => ({
        account: ObjectId(account),
        created: {
            $gte: dateToISO(date.start),
            $lt: dateToISO(date.end)
        },
        name: { $exists: false },
        user: { $exists: true }
    });

    const populateUsers = contacts => new Promise((resolve, reject) => {
        Contact.populate( contacts, { path: 'user', model: 'User' },
            (error, contacts) => {
                if (error) reject (error);
                else resolve( contacts )
            }
        );
    });

    /* assign helpers */
    const mapNames = ({ user: { name } }) => ({ name });
    const reduceManagers = (sum, el) => {
        sum[el.name] = (sum[el.name] || 0) + 1;
        return sum;
    };

    const assign = (state = {}) => contacts => Object.assign({}, state, {
        managers_no_profile: contacts
            .map( mapNames )
            .reduce( reduceManagers, {} )
    });

    return function( reportConfig ) {
        return function( state ) {
            return Contact
                .find( query(reportConfig) )
                .then( populateUsers )
                .then( assign(state) )
                .catch( error => { throw error })
            ;
        }
    }
};

