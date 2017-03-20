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
    const reduceReasons = (sum, el) => {
        sum[el.reason] = (sum[el.reason] || 0) + 1;
        return sum;
    };
    const remapContactsReasons  = ({ noTargetReason }) => ({ reason: noTargetReason });
    const calcReasons = contacts => contacts
        .filter( onlyNoTarget )
        .map( remapContactsReasons )
        .reduce( reduceReasons, {});

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

