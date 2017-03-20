const { orderBy }   = require('lodash');
const { dateToISO, reduceResults } = require('./helpers');

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
    const mapID        = ({ _id }) => _id;
    const isNoTarget  = ({ noTargetReason }) => noTargetReason;
    const isTarget    = ({ noTargetReason }) => !noTargetReason;
    const calcReasons = contacts => orderBy(
        contacts
            .filter( isNoTarget )
            .map( isNoTarget )
            .reduce( reduceResults, [])
        , 'count', 'desc');

    const assign = (state = {}) => contacts => Object.assign({}, state, {
        with_profile: contacts.map( mapID ),
        no_target: contacts.filter( isNoTarget ).map( mapID ),
        target: contacts.filter( isTarget ).map( mapID ),
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

