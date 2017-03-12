function error(text) {
    throw new Error( text )
}

module.exports = function formatNumber( phone, strict = true ) {
    if ( !phone )
        if ( strict ) error('Введите номер')
        else return false;
    let formatted = phone.replace(/ /g,'');
    if ( formatted[0] === '+' && formatted[1] === '7' ) formatted = formatted.replace('+7','');
    if ( formatted[0] === '8' ) formatted = formatted.replace('8','');

    formatted = formatted.replace(/\D/g,'');

    if ( !/^\d+$/.test(formatted) )
        if ( strict ) error('Номер может содержать только цифры')
        else return false;
    if ( formatted.length > 11 )
        if ( strict ) error('Лишние цифры в номере')
        else return false;

    // костыль для аэрофита
    if ( formatted.length === 6 ) formatted = `7212${ formatted }`

    return `+7${ formatted }`;
};
