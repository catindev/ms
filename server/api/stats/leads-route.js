module.exports = (request, response) => {
    const leadsPieChart = require('./leads');
    const moment = require("moment");

    let { start, end } = request.query;
    let currentWeek = true, range = {
        start: moment().startOf('isoWeek').toDate(),
        end: moment().endOf('isoWeek').toDate()
    };

    if ( start && end ) {
        start = new Date( (start.split('.')).reverse() );
        end = new Date( (end.split('.')).reverse() );
        range = { start, end };
        currentWeek = false;
    }

    leadsPieChart({
        start: range.start,
        end: range.end,
        account: request.user.account
    }).then(data => {
        data.unshift(['Источник', 'Эффективность']);
        response.render('stats/leads', {
            data,
            range,
            currentWeek,
            page:"stats",
            subPage: "leads",
            title: 'статистика, рекламные источники',
            user: request.user,
            backURL: '/'
        });
    }).catch( error => { throw error });
};