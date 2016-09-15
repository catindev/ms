module.exports = function buildSearchQuery({ _id, user, search}) {
    let query = _id ? { _id } : {};

    const account = user.account
        ? user.account._id
        : user.type;

    account !== 'admin' && (
        query.account = typeof account === 'object'
            ? account.toString()
            : account
    );

    search && (query.$or = [{
        'name': {
            '$regex': search,
            '$options': 'i'
        }
    }, {
        'phone': {
            '$regex': search,
            '$options': 'i'
        }
    }, {
        'email': {
            '$regex': search,
            '$options': 'i'
        }
    },{
        'notes': {
            '$regex': search,
            '$options': 'i'
        }
    }]);

    return query;
};