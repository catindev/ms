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
    if ( !/^\d+$/.test(formatted) )
        if ( strict ) error('Номер может содержать только цифры')
        else return false;
    if ( formatted.length > 11 )
        if ( strict ) error('Лишние цифры в номере')
        else return false;
    return `+7${ formatted }`;
};
