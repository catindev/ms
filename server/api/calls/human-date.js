const moment = require('moment');
moment.locale('ru');

function formatDateForHumans( originalDate ) {
    const callDate = moment( originalDate );
    const today = moment( new Date() );
    return today.diff( callDate, 'hours' ) <= 23
        ? callDate.fromNow()
        : callDate.format( 'DD MMMM HH:mm' );
}

function isToday( mDate ) {
    const today = moment().startOf('day');
    return mDate.isSame(today, 'd');
}

function formatDate(originalDate) {
    const callDate = moment( originalDate );
    return isToday( callDate )
        ? 'Сегодня, ' + callDate.format( 'D MMMM HH:mm' )
        : callDate.format( 'D MMMM HH:mm' );
}

module.exports = function formatCallDateForHumans( call ) {
    let copy = Object.assign({}, call);
    copy.display.date = formatDate( copy.date );
    return copy;
};
