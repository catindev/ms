const { dateToISO, formatDate } = require('./helpers');

module.exports = function getCustomers({ Contact, ObjectId }) {

    const query = ({ account, date }) => ({
        account: ObjectId(account),
        created: {
            $gte: dateToISO(date.start),
            $lt: dateToISO(date.end)
        }
    });

    const mapID = ({ _id }) => _id;
    const assign = ({ id, name, date }) => customers => ({
        id, account: name,
        period: {
            start: formatDate(date.start),
            end: formatDate(date.end)
        },
        all_customers: customers.map( mapID )
    });


    return function( reportConfig ) {
        return Contact
            .find( query(reportConfig) )
            .then( assign(reportConfig) )
            .catch( error => { throw error })
    }
};



