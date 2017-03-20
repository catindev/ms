const moment = require('moment');
const { findIndex }   = require('lodash');

const formatDate = date => moment( new Date(date) ).format('D MMMM YYYY');
const dateToISO = date => new Date(date).toISOString();

const reduceResults = (results, name) => {
    const indx = findIndex(results, { name });
    indx === -1
        ? results.push({ name, count: 1 })
        : results[ indx ].count += 1
    ;
    return results;
};

module.exports = {
    formatDate,
    dateToISO,
    reduceResults
};