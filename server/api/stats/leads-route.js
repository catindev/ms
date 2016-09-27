module.exports = (request, response) => {
    const leadsChart = require('./leads-by');
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

    leadsChart({
        start: range.start,
        end: range.end,
        interval,
        account: request.user.account
    }).then(data => {
        response.render('stats/leads', {
            data,
            range,
            interval,
            currentWeek,
            page:"stats",
            subPage: "leads",
            title: 'статистика, рекламные источники',
            user: request.user,
            backURL: '/',
            moment
        });
    }).catch( error => { throw error });
};