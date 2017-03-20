const { orderBy, findIndex }   = require('lodash');
const { dateToISO } = require('./helpers');

// TODO: compose?
module.exports = function getCustomersWithProfileTargetAndNotarger({ Contact, ObjectId }) {

    const query = ({ account, date }) => ({
        account: ObjectId(account),
        created: {
            $gte: dateToISO(date.start),
            $lt: dateToISO(date.end)
        },
        name: { $exists: true }
    });

    /* assign helpers */
    const onlyID        = contact => contact._id;
    const onlyNoTarget  = contact => contact.noTargetReason;
    const onlyTarget    = contact => !contact.noTargetReason;
    const remapContactsReasons  = ({ noTargetReason }) => noTargetReason;
    const reduceReasons = (reasons, reason) => {
        const indx = findIndex(reasons, { name: reason });
        indx === -1
            ? reasons.push({ name: reason, count: 1 })
            : reasons[ indx ].count += 1
        ;
        return reasons;
    };
    const calcReasons = contacts => orderBy(
        contacts
            .filter( onlyNoTarget )
            .map( remapContactsReasons )
            .reduce( reduceReasons, [])
        , 'count', 'desc');

    const assign = (state = {}) => contacts => Object.assign({}, state, {
        with_profile: contacts.map( onlyID ),
        no_target: contacts.filter( onlyNoTarget ).map( onlyID ),
        target: contacts.filter( onlyTarget ).map( onlyID ),
        no_target_reasons: calcReasons( contacts )
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

