const { dateToISO } = require('./helpers');
const { orderBy, findIndex }   = require('lodash');

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
    const mapNames = ({ user: { name } }) => name;
    const reduceManagers = (managers, name) => {
        const indx = findIndex(managers, { name });
        indx === -1
            ? managers.push({ name, count: 1 })
            : managers[ indx ].count += 1
        ;
        return managers;
    };

    const calcManagers = contacts => orderBy(
        contacts
            .map( mapNames )
            .reduce( reduceManagers, [] )
        , 'count', 'desc');

    const assign = (state = {}) => contacts => Object.assign({}, state, {
        managers_no_profile: calcManagers( contacts )
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

