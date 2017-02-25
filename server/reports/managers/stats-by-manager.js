const mongoose = require("mongoose");

const Contact = require("../../models/contact")();

const findCallback = paramName => dataLength => {
    let item = {};
    item[paramName] = dataLength;
    return item;
};

const errorCallback = error => { throw error; };

function buildQueries(user, startDate) {
    return [
        { title: 'all customers', query: { user, created: { $gte: startDate } } },

        { title: 'without profile', query: {
            user, created: { $gte: startDate }, name: { $exists: false } }
        },

        { title: 'valid customers', query: {
            user, created: { $gte: startDate },
            noTargetReason: { $exists: false },
            name: { $exists: true }
        } },

        { title: 'invalid customers', query: {
            user, created: { $gte: startDate },
            noTargetReason: { $exists: true },
            name: { $exists: true }
        } }
    ]
}

function createQuery( config, model ) {
    return model.find( config.query )
        .count()
        .then( findCallback( config.title ) )
        .catch( errorCallback );
}

module.exports = function getManagerStats( managerObject, startDateString ) {
    const startDate = new Date( startDateString ).toISOString();
    const user = mongoose.Types.ObjectId( managerObject.id.toString() );

    const queries = buildQueries(user, startDate);

    const pipeline = queries.map( query => createQuery( query, Contact ) );

    return Promise.all( pipeline )
        .then( mergeResults )
        .catch( errorCallback );


    function mergeResults( results ) {
        let resultObject = {};
        results.forEach( result => Object.assign(resultObject, result) );
        Object.assign(resultObject, { name: managerObject.name });

        console.log('results');
        console.log(resultObject);

        return resultObject;
    }

};
