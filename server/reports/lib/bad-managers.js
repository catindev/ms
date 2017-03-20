const { dateToISO, reduceResults } = require('./helpers');
const { orderBy } = require('lodash');

// TODO: возможно стоит считать всех клиентов. Не только в периоде
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
    const mapName = ({ user: { name } }) => name;
    const calcManagers = contacts => orderBy(
        contacts
            .map( mapName )
            .reduce( reduceResults, [] )
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

