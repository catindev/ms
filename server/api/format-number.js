module.exports = function formatNumber( phone ) {
    if ( !phone ) throw new Error('Введите номер');
    let formatted = phone.replace(/ /g,'');
    if ( formatted[0] === '+' && formatted[1] === '7' ) formatted = formatted.replace('+7','');
    if ( formatted[0] === '8' ) formatted = formatted.replace('8','');
    if ( !/^\d+$/.test(formatted) ) throw new Error('Номер может содержать только цифры');
    if ( formatted.length > 11 ) throw new Error('Лишние цифры в номере');
    return `+7${ formatted }`;
};
