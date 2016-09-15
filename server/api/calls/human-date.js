const moment = require('moment');
moment.locale('ru');

function formatDateForHumans( originalDate ) {
    const callDate = moment( originalDate );
    const today = moment( new Date() );
    return today.diff( callDate, 'days' ) <= 12
        ? callDate.fromNow()
        : callDate.format( 'DD MMMM HH:mm' );
}

module.exports = function formatCallDateForHumans( call ) {
    let copy = Object.assign({}, call);
    copy.display.date = moment( copy.date ).format( 'DD MMMM HH:mm' );
    return copy;
};
