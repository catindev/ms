const moment = require('moment');
const calculate = require('./index');

module.exports = (request, response) => {

    const pathToReport = '../ready/' + request.params.id + '.js';

    let report = false;
    try {
        report = require( pathToReport );
    } catch (e) {
        response.end(`
            <style> * { padding: 0; margin: 0;font-family:"Helvetica Neue",Helvetica,sans-serif; }</style>
            <div style="padding: 2rem;">
                <h1 style="font-size: 24px;line-height: 1.7;">Ошибка</h1>
                <p style="font-size: 18px;">
                    Отчёт не найден или ссылка устарела.<br>
                    Обратитесь в поддержку: <strong>+7 (701) 932-02-28, Максим</strong>
                </p>            
            </div>
        `);
    }

    const range = {
        start: moment(report.date).format('D MMMM YYYY'),
        end: moment().format('D MMMM YYYY')
    };

    const render = general => response.render(
        'reports/index', {
            customer: report.customer, general, range, reportID: request.params.id
        }
    );

    calculate(report.managers, report.date)
        .then( render )
        .catch( error => {
            console.log('router error', error.message)
            response.end(error.message)
        });
};