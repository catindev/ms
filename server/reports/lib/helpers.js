const moment = require('moment');
const formatDate = date => moment( new Date(date) ).format('D MMMM YYYY');
const dateToISO = date => new Date(date).toISOString();

module.exports = {
    formatDate,
    dateToISO
};