const list = result.map(call => {
    let mapped = call;
    const today = moment(new Date());
    const callDate = moment(mapped.date);
    console.log('diff', today.diff(callDate, 'days'));
    mapped.date = today.diff(callDate, 'days') <= 1
        ? callDate.fromNow()
        : callDate.format('LL');
    console.log(today.diff(callDate, 'days') <= 1
        ? callDate.fromNow()
        : callDate.format('LL'))
    console.log('date', mapped.date);
    return mapped;
});


function msToTime(ms) {
    let s = `${ Math.floor((ms / 1000) % 60) }`;
    s.length === 1 && (s = `0${ s }`);
    let m = `${ Math.floor((ms / (60 * 1000)) % 60) }`;
    m.length === 1 && (m = `0${ m }`);
    return `${ m }:${ s }`;
}


function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}









