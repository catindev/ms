const moment = require('moment');
moment.locale('ru');

function formatDateForHumans( originalDate ) {
    const callDate = moment( originalDate );
    const today = moment( new Date() );
    return today.diff(callDate, 'days') <= 1
        ? callDate.fromNow()
        : callDate.format('LL');
}

module.exports = function formatCallDateForHumans( call ) {
    let copy = Object.assign({}, call);
    copy.display.date = formatDateForHumans( copy.date );
    return copy;
};
