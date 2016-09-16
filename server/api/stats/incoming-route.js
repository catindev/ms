module.exports = (request, response) => {
    const incoming = require('./incoming');
    const moment = require("moment");

    let { start, end } = request.query, currentWeek = true, range = {
        start: moment().startOf('isoWeek').toDate(),
        end: moment().endOf('isoWeek').toDate()
    };

    if ( start && end ) {
        start = new Date( parseInt(start) );
        end = new Date( parseInt(end) );
        range = { start, end };
        currentWeek = false;
    }

    incoming({
        start: range.start,
        end: range.end,
        account: request.user.account
    }).then(data => {
        !data && (data = []);
        response.render('stats/incoming', {
            data,
            range,
            currentWeek,
            page:"stats",
            subPage: "incoming",
            title: 'статистика, время входящих звонков',
            user: request.user,
            backURL: '/',
            moment
        });
    }).catch( error => { throw error });
}