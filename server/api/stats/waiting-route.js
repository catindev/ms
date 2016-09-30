module.exports = (request, response) => {
    const waitingBarChart = require('./waiting');
    const moment = require("moment");

    let { start, end, interval = 'days' } = request.query;
    let currentWeek = true, range = {
        start: moment().startOf('isoWeek').toDate(),
        end: moment().endOf('isoWeek').toDate()
    };

    if ( start && end ) {
        start = new Date( parseInt(start) );
        end = new Date( parseInt(end) );
        range = { start, end };
        currentWeek = false;
    }

    let querystring = `?start=${ new Date(range.start).getTime() }`;
    querystring += `&end=${ new Date(range.end).getTime() }`;
    querystring += `&interval=${ interval }`;

    waitingBarChart({
        start: range.start,
        end: range.end,
        interval,
        account: request.user.account
    }).then(data => {
        response.render('stats/waiting', {
            data,
            interval,
            range,
            currentWeek,
            querystring,
            page:"stats",
            subPage: "waiting",
            title: 'статистика, скорость ответов на звонки',
            user: request.user,
            backURL: '/',
            moment
        });
    }).catch( error => { throw error });
};