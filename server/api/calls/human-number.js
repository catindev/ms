
function formatNumberForHumans( number ) {
    const re = /(?:([\d]{1,}?))??(?:([\d]{1,3}?))??(?:([\d]{1,3}?))??(?:([\d]{2}))??([\d]{2})$/;
    return number.replace( re,
        ( all, a, b, c, d, e ) => ( a ? a + " " : "" ) + ( b ? b + " " : "" ) + ( c ? c + "-" : "" ) + ( d ? d + "-" : "" ) + e
    );
}

module.exports = function formatCallNumberForHumans( call ) {
    let copy = Object.assign({}, call);
    copy.display.phone = formatNumberForHumans( copy.contact.phone );
    return copy;
};